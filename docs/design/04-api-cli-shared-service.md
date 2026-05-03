# Shared Service Layer, HTTP API, and CLI

The single most important refactor decision: **CLI commands and HTTP
handlers do not implement business logic; they both call into
`internal/services/`.** This is what guarantees parity between
`ws2tcp client add …` on the terminal and the equivalent Web UI form.

## Service interfaces

`internal/services/` defines the only public surface:

```go
package services

type Registry struct {
    Config    ConfigService
    Clients   ClientsService     // server-side identities + ACL
    Endpoints EndpointsService   // client-side reusable server profiles
    Tunnels   TunnelsService     // client-side tunnels (reference Endpoints by name)
    Runtime   RuntimeService     // read-only live state
    Auth      AuthService        // API tokens
    System    SystemService      // start/stop/reload subsystems
}

type ClientsService interface {
    List(ctx) ([]Client, error)
    Get(ctx, id string) (Client, error)
    Create(ctx, Client) error
    Update(ctx, id string, patch ClientPatch) error
    Delete(ctx, id string) error

    SetACL(ctx, id string, rules []ACLRule) error
}

type EndpointsService interface {
    List(ctx) ([]Endpoint, error)
    Get(ctx, name string) (Endpoint, error)
    Create(ctx, Endpoint) error
    Update(ctx, name string, patch EndpointPatch) error
    Delete(ctx, name string, force bool) error  // refuses if force=false and tunnels still reference it

    UsedBy(ctx, name string) ([]string, error)  // tunnel names; powers UI confirms + CLI errors
}

type TunnelsService interface {
    List(ctx) ([]TunnelStatus, error)
    Get(ctx, name string) (TunnelStatus, error)
    Create(ctx, TunnelSpec) error               // TunnelSpec.Endpoint MUST exist; validated here
    Update(ctx, name string, spec TunnelSpec) error
    Delete(ctx, name string) error
    Start(ctx, name string) error
    Stop(ctx, name string) error
}
```

`TunnelSpec` carries only tunnel-local fields:

```go
type TunnelSpec struct {
    Name       string
    Endpoint   string   // foreign-key into EndpointsService
    Listen     string
    TargetHost string
    TargetPort uint16
}
```

Each method does three things, in order:

1. Validate input.
2. Persist via `services.Config` (writes `config.yaml` atomically via
   `gopkg.in/yaml.v3` `*yaml.Node`, preserving comments/order).
3. Apply to the running subsystem (server user table swap, or
   `core/client.Manager` reset).

If step 3 fails, step 2 is rolled back before returning the error —
making the visible config and the running daemon match at all times
is a hard invariant.

## HTTP API (`internal/api/`)

Mounted under `app.http_listen`. Built on **gin**:

- Engine: `gin.New()` (we don't use `gin.Default()` — its built-in
  logger writes plain text; we replace it with a slog-backed
  middleware that emits the same structured fields as the rest of the
  daemon).
- Middleware order: `gin.Recovery()` → `requestid` → `slog access log`
  → `auth.RequireToken(scope)` per route group.
- Route groups: `/api` (REST, JSON), `/api/events` (live streams,
  see below), `/` (SPA fallback served from the embedded FS).

### Live status / log streaming

The roadmap calls for the Web UI to render live tunnel state and tail
the daemon log. Two complementary endpoints under `/api/events`,
mounted as gin handlers that hijack the underlying `net.Conn`:

- `GET /api/events/stream`  — Server-Sent Events. Topics:
  `tunnel.state`, `tunnel.metrics`, `server.conn.opened`,
  `server.conn.closed`. Cheap, one-way, survives proxies.
- `GET /api/events/ws`      — WebSocket, same topics plus `log.line`
  for log tailing (volume too high for SSE in busy environments).
  Upgraded with `coder/websocket.Accept(c.Writer, c.Request, …)` —
  the same library used on the data plane, so no extra dependency.

Both endpoints pull from a single in-process pub/sub bus
(`internal/services/events`). Gin makes mixing JSON REST and these
streaming handlers in one engine trivial; that was the deciding
factor over chi.

### Endpoints

```
GET    /api/health                       no auth
GET    /api/version                      no auth

# Server identities + ACL
GET    /api/server/clients
POST   /api/server/clients
GET    /api/server/clients/{id}
PATCH  /api/server/clients/{id}
DELETE /api/server/clients/{id}
PUT    /api/server/clients/{id}/acl

# Server runtime
GET    /api/server/connections           list live ws connections
POST   /api/server/connections/{id}:kick force-close one
GET    /api/server/stats

# Client server-endpoints (reusable connection profiles)
GET    /api/client/endpoints
POST   /api/client/endpoints
GET    /api/client/endpoints/{name}
PATCH  /api/client/endpoints/{name}
DELETE /api/client/endpoints/{name}?force=true|false
GET    /api/client/endpoints/{name}/used-by   # list of dependent tunnel names

# Client tunnels (reference an endpoint by name)
GET    /api/client/tunnels                    # response items include `endpoint`
POST   /api/client/tunnels                    # 422 if `endpoint` is unknown
GET    /api/client/tunnels/{name}
PATCH  /api/client/tunnels/{name}
DELETE /api/client/tunnels/{name}
POST   /api/client/tunnels/{name}:start
POST   /api/client/tunnels/{name}:stop

# Config (raw escape hatch + introspection)
GET    /api/config                        full snapshot, secrets redacted
PUT    /api/config                        replace whole file (validated)
GET    /api/config/path                   absolute path on disk

# Tokens (admin scope only)
GET    /api/auth/tokens
POST   /api/auth/tokens                   returns plaintext exactly once
DELETE /api/auth/tokens/{name}
```

JSON bodies map 1:1 to the `services.*Spec` structs. Errors use a
small envelope `{ "code": "ACL_DENY", "message": "...", "details": …}`.

### Auth model

`Authorization: Bearer <token>` header, verified against argon2id
hashes in `data/tokens.yaml`. For `/api/events/ws` the token is also
accepted as a `?token=` query param, since browsers can't set headers
on the native `WebSocket()` constructor. Three scopes:

- `admin` — everything, including token CRUD.
- `client:write` — tunnel CRUD + start/stop.
- `server:write` — identity + ACL CRUD + connection kick.
- `read` — implied by the others; standalone for read-only dashboards.

If `app.http_listen` is loopback **and** `app.http_auth=false`, the
auth middleware is bypassed. Any non-loopback bind forces auth on
regardless of config (config validator enforces this).

## CLI (`cmd/`)

The CLI is a thin shell over `services.Registry`. Two binding modes:

- **In-process**: when no daemon is running (or running but the user
  prefers direct), commands open the config tree, build a *read-only*
  `Registry` against the on-disk state, and operate. Useful for
  bootstrap (`ws2tcp config token add` before any daemon exists).
- **Remote**: when a daemon is up, commands talk to its HTTP API using
  a token saved in `data/cli-token` (created on first `install`). This
  is the path that takes effect on the live process.

`ws2tcp config endpoint` toggles the default. By default the CLI tries
remote, falls back to in-process with a warning.

### Command surface

```
ws2tcp run                                   # foreground
ws2tcp install / uninstall / start / stop / status
ws2tcp version

ws2tcp config show
ws2tcp config edit                           # opens $EDITOR on config.yaml
ws2tcp config set <dotted.key> <value>
ws2tcp config path
ws2tcp config token add  --name <n> --scope admin
ws2tcp config token list
ws2tcp config token rm   <name>

ws2tcp server clients list
ws2tcp server clients add    --id … --secret … [--acl …]
ws2tcp server clients update <id> [--secret …] [--acl …]
ws2tcp server clients rm     <id>
ws2tcp server acl  set       <id> <rule>...   # rule = "192.168.0.0/16:22,80,8000-8999"
ws2tcp server conns list
ws2tcp server conns kick     <connId>

ws2tcp client endpoints list
ws2tcp client endpoints add    --name … --host … --port … [--wss] [--path /connect]
                               --aes-key … --client-id … --client-secret …
ws2tcp client endpoints update <name> [--host …] [--port …] [--aes-key …] …
ws2tcp client endpoints rm     <name> [--force]
ws2tcp client endpoints show   <name>          # full settings + tunnels using it

ws2tcp client tunnels list                     # default columns: NAME ENDPOINT STATE LISTEN TARGET CONNS
ws2tcp client tunnels add    --name … --endpoint <ep-name> --listen … --target host:port
ws2tcp client tunnels update <name> [--endpoint …] [--listen …] [--target …]
ws2tcp client tunnels rm     <name>
ws2tcp client tunnels start  <name>
ws2tcp client tunnels stop   <name>
```

`server acl set` accepts a compact textual form
`<cidr>:<ports>[,<ports>…]` so it's pleasant to type; the parser is
the inverse of how the YAML gets serialized back.

`tunnels add` validates `--endpoint` against `EndpointsService.Get`
before writing anything. `endpoints rm` returns the
`UsedBy(name)` list in its error message when the endpoint is in use,
so the operator knows which tunnels to remove (or `--force`) without
a second command.

Output: human-formatted tables by default; `--json` for machine
consumption. Both go through the same `services.*` calls — the CLI
just renders.

## Why this layering matters

- **No drift.** A new field added to `TunnelSpec` shows up in CLI,
  HTTP API, and Web UI by extending one struct + its validator.
- **One audit log.** Every mutation flows through `services.*`, so a
  single `slog` audit hook captures who (token name or `local-cli`),
  what (method), and the diff. No need to instrument both layers.
- **Testability.** `services` has no transport dependencies, so unit
  tests cover the business rules (ACL parser, atomic config rewrite,
  tunnel reset semantics) without spinning up a server or fork-execing
  a binary.
