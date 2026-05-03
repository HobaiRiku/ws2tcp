# ws2tcp Go Rewrite — Overall Design

Status: Draft  ·  Date: 2026-05-03

This document is the umbrella design for porting the existing Node.js
`websocket2Tcp` tool to Go, based on the in-house starter described in
[golang-cli-service-architecture.md](../golang-cli-service-architecture.md).
Sub-designs live alongside this file:

- [01-config-and-storage.md](./01-config-and-storage.md) — config/data root, YAML schema, hot reload
- [02-server-acl-auth.md](./02-server-acl-auth.md) — multi-user auth + CIDR/port ACL
- [03-client-tunnel-manager.md](./03-client-tunnel-manager.md) — multi-tunnel client lifecycle
- [04-api-cli-shared-service.md](./04-api-cli-shared-service.md) — shared service layer, REST API, CLI verbs, token auth
- [05-webui.md](./05-webui.md) — Fluent UI + Vue 3 frontend
- [06-build-and-testing.md](./06-build-and-testing.md) — Makefile targets, unit / service / e2e test strategy

## Goals

1. **Single binary** that runs both the WebSocket-to-TCP server *and*
   the local TCP-to-WebSocket client roles. Either role is independently
   toggleable via config; both can run in the same process simultaneously.
2. **YAML-first** human-editable config and data tree under
   `~/.ws2tcp/` (overridable via `WS2TCP_HOME`). The whole binary is
   stateless w.r.t. the working directory; everything resolves from this
   root.
3. **One service core, three frontends**:
   CLI (cobra), HTTP REST API (gin), and Web UI (Fluent UI Web Components
   + Vue 3) all call the same Go service abstractions — no business
   logic duplicated between them.
4. **Feature parity** with the current Node.js implementation:
   AES-256-CBC handshake command, end-to-end-encrypted data frames,
   `streamUp` framing (with legacy text fallback), `clientConnectionId`
   anti-replay, `trustProxy` IP resolution, optional native WSS.
5. **New capabilities**:
   - Server: per-client **ACL** (CIDR + port ranges) on top of
     id/secret auth.
   - **Server Endpoint** as a first-class, named business object:
     a reusable bundle of remote ws2tcp-server connection settings
     (host/port/path/wss/aes_key/client credentials). Tunnels reference
     an endpoint by name; you create the endpoint first, then point
     tunnels at it. One endpoint, many tunnels.
   - Client: a single client process manages **N tunnels** concurrently;
     editing or stopping a tunnel resets only its own connections.
   - Token-authenticated HTTP API with configurable bind address (default
     loopback only).

## Non-goals (v1)

- Cluster/HA: `clientConnectionId` replay protection stays in-process,
  matching today's behaviour.
- Plugin system, auto-update, metrics scraping. Listed as future
  extensions in the starter doc; out of scope here.
- TCP-side TLS termination (only the WS leg can be wss).

## Dependencies

Carried from the starter, with YAML, gin, and WebSocket adjustments:

| Concern              | Module                          | Notes |
|----------------------|---------------------------------|-------|
| CLI                  | `github.com/spf13/cobra`        | root + subcommands |
| Config               | `github.com/spf13/viper`        | YAML driver (built in) |
| Service host         | `github.com/kardianos/service`  | install/start/stop/uninstall |
| HTTP framework       | `github.com/gin-gonic/gin`      | API + SSE/WebSocket-friendly middleware + static handler |
| Cross-platform paths | `github.com/adrg/xdg`           | only as fallback if `WS2TCP_HOME` unset |
| WebSocket (data plane) | `github.com/coder/websocket`  | `NetConn` wraps WS as `net.Conn` so we can `io.Copy` it against the TCP side |
| WebSocket (mgmt plane) | `github.com/coder/websocket`  | reused for the future Web UI live-status / log-streaming endpoint mounted on gin |
| Static embed         | `embed` (stdlib)                | `web/dist` |
| Logging              | `log/slog` (stdlib)             | JSON to `data/logs/`, text to stderr in `run` |
| Local DB             | *not used in v1*                | config files alone are enough; revisit if metrics/audit grow |
| YAML (lower-level)   | `gopkg.in/yaml.v3`              | only for surgical writes from CLI/API; viper handles reads |

Rationale notes:

- **viper + YAML**: viper supports YAML natively and gives us env-var
  override and (optional) hot reload for free. We only drop down to
  `gopkg.in/yaml.v3` when the API/CLI needs to edit a single key while
  preserving comments and key ordering — `yaml.v3`'s `*yaml.Node` API
  preserves both, which is exactly what an admin-editable file needs.
- **gin over chi**: gin is the more familiar choice on the team and
  has a richer middleware ecosystem; more importantly the user-facing
  feature roadmap calls for a live log / connection-status WebSocket
  on the management plane, and gin's `c.Writer.Hijack()` + the same
  `coder/websocket` library used on the data plane gives us one
  upgrade path with no extra dependency. Anything chi could do here is
  a one-liner in gin.
- **coder/websocket vs gorilla**: `coder/websocket.NetConn(ctx, c, MessageBinary)`
  returns a `net.Conn`, so the entire data plane becomes two
  `io.Copy(tcp, ws)` / `io.Copy(ws, tcp)` goroutines wrapped around our
  AES Reader/Writer — a much cleaner equivalent of today's
  `wsStream.pipe(...)` chain. Reusing it on the management plane keeps
  the dependency surface small.

## Directory layout

```
ws2tcp/
├── main.go
├── Makefile
├── .goreleaser.yaml
│
├── cmd/                          # cobra commands; thin wrappers around services/
│   ├── root.go
│   ├── run.go                    # foreground daemon
│   ├── install.go / uninstall.go
│   ├── start.go / stop.go / status.go
│   ├── version.go
│   ├── client.go                 # `ws2tcp client list|add|update|rm|start|stop`
│   ├── server.go                 # `ws2tcp server users|acl|conns`
│   └── config.go                 # `ws2tcp config show|set|edit|path`
│
├── internal/
│   ├── app/                      # composition root: wires config -> services -> http
│   ├── paths/                    # WS2TCP_HOME resolution, ensures dir tree
│   ├── config/                   # YAML schema + viper loader + atomic writer (yaml.v3 Node)
│   ├── log/                      # slog setup, rotating file writer
│   ├── service/                  # kardianos/service hooks (Start/Stop)
│   │
│   ├── core/                     # ↓ business core, framework-agnostic ↓
│   │   ├── crypto/               # AES helpers + EncryptStream/DecryptStream as io.Reader/Writer
│   │   ├── frame/                # streamUp frame encode/decode (parity with utils/aes.mjs)
│   │   ├── wsproxy/              # shared bridge: pipe net.Conn <-> net.Conn with optional crypto
│   │   ├── server/               # WS server: upgrade, auth, ACL, dial target, anti-replay
│   │   └── client/               # tunnel manager: N tunnels, each with local listener
│   │
│   ├── api/                      # gin handlers + routers; map HTTP <-> services/
│   │   └── ws/                   # mgmt-plane websocket endpoints (live logs, conn events)
│   ├── services/                 # ⇐ THE shared abstraction layer (CLI + API call this)
│   │   ├── clients.go            # CRUD for ws2tcp client identities (server-side users)
│   │   ├── acl.go                # ACL rule CRUD
│   │   ├── tunnels.go            # CRUD + start/stop for client-side tunnels
│   │   ├── runtime.go            # live state: active connections, counters
│   │   └── auth.go               # API token issue/verify
│   │
│   └── web/                      # embed + SPA fallback handler
│
└── web/
    ├── package.json              # vite + vue3 + @fluentui/web-components
    ├── src/
    └── dist/                     # built artifact, embedded
```

The split between `internal/core/` (raw protocol logic, ports of
`server.mjs`/`client.mjs`/`utils/aes.mjs`) and `internal/services/`
(stateful façade used by both CLI and HTTP) is the central refactor:
it's what guarantees the CLI and Web UI cannot drift.

## Process model

```
ws2tcp run / start
  └─ app.Run(ctx)
       ├─ paths.Resolve()            # honors $WS2TCP_HOME, default ~/.ws2tcp
       ├─ config.Load()              # reads config.yaml, validates schema
       ├─ log.Init()                 # JSON file + console mirror
       ├─ services.New(cfg, store)   # builds shared service registry
       ├─ if cfg.Server.Enabled:  go core/server.Run(ctx, services)
       ├─ if cfg.Client.Enabled:  go core/client.Run(ctx, services)
       ├─ if cfg.HTTP.Enabled:    go api.Serve(ctx, services)
       └─ wait(SIGINT/SIGTERM) → ctx.Cancel → graceful drain
```

Each subsystem owns its own context derived from the root, so the API
layer can restart the server or a client tunnel by cancelling its
sub-context — no process restart needed. This is the basis for "edit
a tunnel = reset its connections only" (see
[03-client-tunnel-manager.md](./03-client-tunnel-manager.md)).

## Mapping from existing Node code

| Node file / concept                        | Go destination |
|--------------------------------------------|----------------|
| `utils/aes.mjs` — `aesEncrypt/Decrypt`     | `internal/core/crypto/aes.go` |
| `utils/aes.mjs` — `EncryptStream/DecryptStream` | `internal/core/crypto/stream.go` (`io.Reader`/`io.Writer` wrappers, same 2-byte length + IV + ciphertext layout) |
| `utils/aes.mjs` — `createStreamUpFrame` / `parseStreamUpFrame` | `internal/core/frame/streamup.go` |
| `server.mjs` — HTTP upgrade + path/host check | `internal/core/server/upgrade.go` |
| `server.mjs` — `authenticate()`            | `internal/core/server/auth.go` (delegates to `services.Clients.Verify`) |
| `server.mjs` — `getClientIp` / `trustProxy`| `internal/core/server/ip.go` |
| `server.mjs` — `clientConnectionIdList`    | `internal/core/server/replay.go` (sync.Map with TTL) |
| `server.mjs` — connection bridging         | `internal/core/wsproxy/bridge.go` |
| `client.mjs` — TCP listener + ws dial      | `internal/core/client/tunnel.go` |
| `client.mjs` — 20s ping                    | built in via `coder/websocket` ping helper |
| `config.*.example.json`                    | replaced by `config.yaml` example in `01-config-and-storage.md` |

## Wire compatibility

The new server **must** stay byte-compatible with existing Node clients
(and vice versa) for at least one release. Concretely:

- `?command=` query param: same `clientId:clientSecret:targetHost:targetPort:clientConnectionId`
  joined string, same AES-256-CBC + base64 + URL-encode.
- `streamUp` frame: same `[0x01,0x01,0x01|0x02]` header, same 32-byte
  endToEndKey body when encrypted, AES-encrypted with shared `aesKey`
  on the wire. Legacy plaintext `"streamUp"` accepted by the Go client
  for one release, then dropped.
- Data plane frames in encrypted mode: same `uint16 BE length | 16B IV
  | ciphertext` chunking, with `maxChunkSize = 32768 - 16 - 1` to match
  the existing `EncryptStream`.

A small interop test (Go server vs. Node client and vice versa) lives
under `tests/interop/` and is part of `make test`.

## What changes user-visibly

- One binary instead of two scripts. `node server.mjs -c …` becomes
  `ws2tcp run` (foreground) or `ws2tcp start` (service).
- Config moves from a pair of JSON files to a single YAML tree under
  `~/.ws2tcp/config.yaml`, with top-level `server:` and `client:`
  sections. CLI/Web UI edits write back to this file.
- The client can hold many tunnels in one process; each old "one
  process per tunnel" config maps to one entry in `[[client.tunnels]]`.
- A token-protected HTTP API + Web UI on `127.0.0.1:7321` by default.
