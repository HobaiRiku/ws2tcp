# Client: Multi-Tunnel Manager

Today: one Node process == one tunnel. Restarting or editing means
killing the process and respawning. The Go client lifts this so a
single process holds an arbitrary number of tunnels, each independently
restartable.

## Concepts

- **ServerEndpoint**: a named, reusable bundle of "how to reach a
  remote ws2tcp server" — host/ip/port/path/wss/aes_key/client
  credentials. First-class business object owned by
  `services.Endpoints`. Created and edited independently of tunnels.
- **Tunnel**: a `(name, endpoint, listen, target_host, target_port)`
  5-tuple. The `endpoint` field is a **name reference** into the
  endpoint registry — the tunnel does not embed connection details.
  Identified by unique `name`.
- **Connection**: a single end-user TCP session inside a tunnel —
  one accepted local TCP socket and its paired WebSocket. A tunnel
  has 0..N connections at any time.
- **TunnelManager**: owns the set of running tunnels, exposes
  `Add/Update/Remove/Start/Stop/List` to the services layer. On every
  start/restart it resolves `tunnel.endpoint → EndpointSpec` from the
  registry; the resolved snapshot is what handleConn uses for the
  lifetime of *that* connection.

### Why a separate object

- Most users have 1–2 servers and many tunnels into them. Embedding
  the same nine fields per tunnel was a footgun: rotating an
  `aes_key` meant editing every tunnel.
- Editing an endpoint is now a single operation that fans out to all
  consumers via the manager (see "Reload coupling" below).
- The CLI/UI can show `tunnel → endpoint` as a foreign-key relation
  and let users pick from a dropdown when creating a tunnel.

## Lifecycle

Each tunnel runs under its own `context.Context` derived from the
client root context. The manager keeps a registry:

```go
type tunnelEntry struct {
    spec    TunnelSpec
    cancel  context.CancelFunc
    state   atomic.Value          // running | stopped | failed
    conns   *connSet              // live connections, for accounting + drain
    metrics tunnelMetrics
}

type Manager struct {
    mu      sync.Mutex
    entries map[string]*tunnelEntry   // by name
    root    context.Context
}
```

Reset rule: `Update(spec)` and `Remove(name)` cancel the entry's
context, wait for `conns.Drain()`, then (for Update) re-create with
the new spec. **Other tunnels are untouched.** This is the central
property the user asked for: editing one tunnel resets only that
tunnel's connections.

## Per-tunnel runtime

```
tunnelLoop(ctx, spec):
  ln, _ := net.Listen("tcp", spec.Listen)
  defer ln.Close()
  go func() { <-ctx.Done(); ln.Close() }()
  for {
      tcp, err := ln.Accept()
      if errors.Is(err, net.ErrClosed) { return }
      if err != nil { backoff; continue }
      go handleConn(ctx, spec, tcp)
  }
```

`handleConn` mirrors `client.mjs`. It first resolves the named
endpoint (`ep := endpoints.Get(spec.Endpoint)`) — failing fast if
the name no longer exists — then:

1. Build the auth string `ep.ClientID:ep.ClientSecret:spec.TargetHost:
   spec.TargetPort:connId`, AES-encrypt with `ep.AESKey`, base64 +
   URL-encode.
2. `websocket.Dial(ctx, wssURL, &DialOptions{
       HTTPHeader: {"Host": ep.Host},
       TLSClientConfig: &tls.Config{InsecureSkipVerify:
           !ep.SSLRejectUnauthorized},
   })`. The dial target uses `ep.IP` if set, else `ep.Host`. Note
   `coder/websocket` doesn't expose an `origin` option, but sets it
   via `HTTPHeader` if needed for parity.
3. Read **one** message: parse the streamUp frame (handles both new
   binary form and legacy `"streamUp"` plaintext). If `useEncrypt`,
   keep the 32-byte endToEndKey.
4. `nc := websocket.NetConn(ctx, ws, MessageBinary)` — gives a
   `net.Conn`. Hand `(tcp, nc, key)` to `wsproxy.Bridge`.
5. On return (either side closed or errored), close both, deregister
   from `conns`.

Pings are handled inside `coder/websocket` via
`websocket.Conn.Ping(ctx)` from a 20s ticker goroutine — equivalent of
today's `setInterval(() => ws.ping(), 20_000)`.

## Backoff and failure handling

- `Listen` failure (port in use) marks the tunnel `state=failed` with
  the error reason and stops; the API/UI surfaces it. The manager does
  **not** retry-loop forever on bind failures — that's a config
  problem, not a transient one.
- `ws.Dial` failure inside `handleConn` only fails that connection;
  the listener stays up. Counters increment; no backoff between accepts
  (the local TCP client controls retry cadence).
- Per-tunnel circuit breaker (optional v1.x): if `>N` consecutive
  dial failures within a window, mark tunnel `degraded` and surface in
  the UI. Listed but not built in v1.

## Reload coupling

There are two mutation entry points the manager reacts to:

### Tunnel-level edits

When `services.Tunnels.Update(name, newSpec)` is called from the API
or CLI:

```
mu.Lock()
old := entries[name]
entries[name] = nil
mu.Unlock()

old.cancel()
old.conns.Drain(timeout = 10s)   // wait for io.Copy to return
                                 // forced close after timeout

newCtx, cancel := context.WithCancel(rootCtx)
entry := newEntry(newSpec, cancel)
go tunnelLoop(newCtx, newSpec)

mu.Lock()
entries[name] = entry
mu.Unlock()
```

The same path runs when the fsnotify watcher detects a config edit
and diff-applies tunnels (add / remove / update by name + content
hash). The diff is computed in `services.Tunnels.Sync(cfg)` so the
manager sees only individual operations.

### Endpoint-level edits (fan-out)

`services.Endpoints.Update(name, newSpec)` resets every tunnel that
references this endpoint. Implementation:

```
affected := tunnels.ListByEndpoint(name)
for _, t := range affected {
    manager.Reset(t.Name)        // same path as Tunnels.Update
}
```

This is the central reason `endpoint` is a name reference, not an
embedded copy: a single rotate-aes-key operation invalidates every
relevant tunnel atomically without forcing the operator to edit each
one. Tunnels not referencing the changed endpoint are untouched.

`services.Endpoints.Delete(name)` is rejected if any tunnel still
references it; the error returns the offending tunnel names so the
UI can offer "delete these too" as an explicit follow-up.

## Observable state for API/UI

`services.Runtime` exposes (read-only) per-tunnel:

```go
type TunnelStatus struct {
    Name        string
    Endpoint    string    // referenced endpoint name; surfaced in CLI/UI
    State       string    // running | stopped | failed | degraded
    Listen      string
    Target      string    // "host:port"
    Connections int
    Bytes       struct{ In, Out uint64 }
    LastError   string    // empty if healthy
    StartedAt   time.Time
}
```

`Endpoint` is required output: every CLI table and UI list of tunnels
shows which endpoint it uses, so the foreign-key relationship is
visible without an extra lookup.

Connections count and byte counters are atomically incremented inside
`wsproxy.Bridge` via small wrappers around `io.Copy` (we replace the
two `io.Copy` calls with `io.CopyBuffer` against a tracking writer to
avoid per-byte overhead).

## Testing

A `core/client` test starts a Go ws2tcp server in-process, brings up
two tunnels pointing at two `httptest.NewServer`s, and asserts that
`Update(tunnelA)` does not interrupt traffic on `tunnelB`. This
captures the headline guarantee.
