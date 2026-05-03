# Server: Auth + ACL

The Node implementation only checks `clientId`/`clientSecret` and
de-duplicates `clientConnectionId`. The Go rewrite keeps that as the
**identity** layer and adds a separate **authorization** layer (ACL)
on top of it.

## Identity (parity with today)

```
?command=base64(AES-256-CBC(
    "<id>:<secret>:<targetHost>:<targetPort>:<connId>"
))
```

`internal/core/server/auth.go`:

1. URL-decode + base64-decode + AES-CBC-decrypt with `server.aes_key`.
2. Split on `:` (5 parts).
3. Look up `(id, secret)` in the in-memory user table built from
   `[[server.clients]]`. Constant-time compare on the secret.
4. Reject if `connId` is already live (anti-replay; see below).
5. Return a `Principal{ID, ACL, ConnID}` carried through the rest of
   the upgrade.

### Anti-replay store

Replaces today's `clientConnectionIdList` array. Implementation:

```go
type replayStore struct {
    mu  sync.Mutex
    ids map[string]time.Time   // connId -> insertedAt
}
```

- `Reserve(connId)` returns `false` if the id is live, else inserts and
  returns true.
- `Release(connId)` removes the entry on connection close.
- A janitor goroutine drops entries older than 5 minutes — defends
  against leaks if a `Release` is missed (today's Node code can leak
  on certain error paths).

In-process only, same scope as Node. A future cluster mode would back
this with Redis; the interface is what matters.

## Authorization (new)

ACL rules live next to the user, not as a global table:

```yaml
server:
  clients:
    - id: test1
      secret: test1
      acl:
        - cidr: 192.168.1.0/24
          ports: ["22", "80", "443"]
        - cidr: 10.0.0.0/8
          ports: ["3306", "6379", "8000-8999"]
```

### Data model

```go
type ACLRule struct {
    CIDR  netip.Prefix     // parsed once at config load
    Ports []PortRange      // sorted, mergeable
}

type PortRange struct{ Lo, Hi uint16 }

type Client struct {
    ID, Secret string
    ACL        []ACLRule
}
```

`netip.Prefix` (stdlib `net/netip`) is preferred over `net.IPNet` —
it's value-type, allocation-free, and has direct `Contains(addr)`.

### Match algorithm

On each upgrade, after identity verification:

```go
func (c *Client) Allows(targetHost string, targetPort uint16) (bool, error) {
    addrs, err := lookupHost(targetHost)   // see "Host resolution" below
    if err != nil { return false, err }

    for _, addr := range addrs {
        for _, rule := range c.ACL {
            if rule.CIDR.Contains(addr) && rule.matchPort(targetPort) {
                return true, nil
            }
        }
    }
    return false, nil
}
```

Rejection writes `403 Forbidden: ACL` to the upgrade socket and is
logged with `{client_id, target_host, target_port, resolved_ips}` so an
operator can debug why a tunnel was denied.

### Host resolution policy

`targetHost` may be an IP literal *or* a DNS name. Two questions to
settle in code review, with the strict default below:

- **Resolve at upgrade time** (default, strict): `net.DefaultResolver
  .LookupNetIP(ctx, "ip", host)`, *all* returned addresses must satisfy
  the ACL. Mitigates DNS rebinding to a now-blocked IP.
- **Pin the resolved IP for the lifetime of the connection**: the
  server then dials that IP literal, not the original host. Stronger
  guarantee but breaks SNI-style targets. Off by default; opt-in via
  `server.dial_pinned_ip = true`.

For literal IPs (most common in this tool's intranet use case), both
modes collapse to a single `netip.ParseAddr` and a direct CIDR check.

### ACL edits while connections are live

The user table is held behind an `atomic.Pointer[users]`. CRUD
operations build a new immutable copy and `Store` it. Existing
connections keep the snapshot they were authorized under (we don't
forcibly drop them on rule edit) — same as iptables-style
"established connections persist". Future improvement: optional
`--reauth-active` flag on the API to walk live connections and drop
those that no longer match.

## IP source for `trust_proxy`

Direct port of the current `getClientIp` logic, with the same warning
in the log on startup if `trust_proxy=true`:

```
WARN trust_proxy is enabled; only safe behind a reverse proxy that
     overwrites X-Forwarded-For/X-Real-IP for each request.
```

The resolved client IP feeds two things:

1. Structured logs (`client_ip` field).
2. A per-client connection counter exposed at `/api/server/connections`.

It does **not** participate in ACL matching — ACL is about the *target*
of the tunnel, not the source. This matches the threat model: the user
already authenticated via id/secret, ACL constrains what they can reach
through us.

## Connection lifecycle inside the server

```
upgrade()
  ├─ check ws_path / ws_host
  ├─ identity := authenticate(query.command)
  ├─ if !replay.Reserve(identity.ConnID): 401
  ├─ if !identity.Client.Allows(target):  403
  ├─ tcp, err := dialer.Dial(target);  if err: 502
  ├─ ws := websocket.Accept(...)
  ├─ ws.Write(streamUp frame, encrypted with server.aes_key)
  └─ wsproxy.Bridge(ctx, websocket.NetConn(ws), tcp, encryptionKey)
        │
        └─ on return: replay.Release; logs.Close
```

`wsproxy.Bridge` is the single shared bridge function used by both the
server (ws → tcp) and, in the client, the inverse (tcp → ws). It
receives two `net.Conn`s and an optional symmetric key; with key set,
it inserts `crypto.NewEncryptWriter` / `crypto.NewDecryptReader` on
the WS side. Two goroutines, `io.Copy` each direction, first error
cancels the shared context.
