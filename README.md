# ws2tcp

> Tunnel TCP traffic over WebSocket through HTTP/HTTPS reverse proxies — single binary, built-in Web UI.

ws2tcp is a WebSocket → TCP proxy. When your reverse proxy only allows HTTP(S) but you need SSH, database, or custom TCP protocols to reach through, ws2tcp wraps the client-side TCP connection into a WebSocket, forwards it to the server, and the server dials the real TCP target.

```
┌──────────┐  TCP    ┌────────────┐  WS / WSS   ┌────────────┐  TCP   ┌──────────┐
│ ssh / db │ ─────▶  │ ws2tcp     │ ──────────▶ │ nginx /    │ ─────▶ │ ws2tcp   │ ─────▶ target:22 / :3306 / ...
│ client   │         │ (client)   │             │ caddy /…   │        │ (server) │
└──────────┘         └────────────┘             └────────────┘        └──────────┘
                      local listener             HTTP(S) only          LAN dial
```

A single binary can act as server, client, or both simultaneously — driven by `~/.ws2tcp/config.yaml`. The Web UI is embedded in the binary; open `http://127.0.0.1:7321` to manage endpoints, tunnels, and clients, and to monitor live connections and logs.

[中文文档](README_zh.md)

---

## Features

- **Single binary**: Written in Go, cross-platform (macOS / Linux / Windows), statically linked, no runtime dependencies.
- **System service**: Powered by [`kardianos/service`](https://github.com/kardianos/service) — one `ws2tcp install` registers it as a launchd / systemd / Windows SCM service.
- **Embedded Web UI**: Vue 3 SPA bundled in, no separate deployment needed.
- **End-to-end encryption**: AES-256 signaling layer (fixed key); optionally a per-connection 32-byte one-time e2e key for the data plane (`use_encryption=true`).
- **ACL**: Per-client CIDR + port-range allowlists with independent credentials.
- **Hot reload**: API changes apply immediately; transport-layer fields (listen / TLS / aes_key) automatically restart the relevant subsystem, not the whole process.

---

## Use cases

- Internal SSH or database that needs to be reachable from outside, but the only egress is port 80/443
- Existing HTTPS reverse proxy (nginx, caddy, Cloudflare, etc.) you want to reuse for certificate termination and edge auth
- Private TCP protocol that needs to plug into CI / SaaS webhook pipelines

---

## Important notes

- Use only with **explicit authorization from the administrator or system owner**, especially in production, corporate networks, cloud hosts, jump servers, and database segments.
- Treat `aes_key`, `http_token`, `client_id`, and `client_secret` as sensitive credentials — keep them out of repositories, chat logs, ticket screenshots, and public logs.
- Assign independent credentials per environment and per client; minimize ACL scope; rotate keys and secrets regularly.
- For production deployments: put the management UI behind HTTPS/WSS, restrict its source IP, and ensure log and config files are readable only by trusted accounts.

---

## Quick start

### Install via Homebrew

```bash
brew tap HobaiRiku/tap
brew install --cask ws2tcp
ws2tcp version
ws2tcp run
```

On first launch, `~/.ws2tcp/config.yaml` is generated with a random admin token, a random AES key, and a ready-to-use sample configuration.

Open `http://127.0.0.1:7321`, copy `app.http_token` from `~/.ws2tcp/config.yaml`, and log in to start configuring.

### Run as a system service

```bash
sudo ws2tcp install       # register with launchd/systemd/SCM
sudo ws2tcp start
ws2tcp status
```

The service environment pins `WS2TCP_HOME` to the path resolved at install time, so the correct config is found even when running as root.

### Build from source

```bash
git clone https://github.com/HobaiRiku/ws2tcp.git
cd ws2tcp
make build               # output: build/bin/ws2tcp (with embedded Web UI)
./build/bin/ws2tcp version
./build/bin/ws2tcp run
```

Build requirements: Go 1.23+, `pnpm` (or `corepack enable`), `make`.

---

## Configuration example

```yaml
app:
  http_listen: 127.0.0.1:7321
  http_auth: true
  http_token: 7c2d4b...e1               # auto-generated randomly on first init
  log_level: info
  log_console: false                   # mirror to stderr/stdout (off by default)
  log_max_size_mb: 20
  log_max_backups: 10
  log_max_age_days: 14
  log_compress: false

server:
  listen: 0.0.0.0:3005
  ws_path: /connect
  aes_key: njpjvjkgfykgpqpcksvjydvlctgznlnz   # 32 bytes, signaling layer
  use_encryption: true                  # data-plane end-to-end encryption
  trust_proxy: false
  tls:
    enabled: false
    cert: certs/cert.pem
    key:  certs/key.pem
  clients:
    - id: alice
      secret: alice-secret
      acl:
        - cidr: 192.168.1.0/24
          ports: ["22", "3306"]

client:
  endpoints:
    - name: edge
      host: gateway.example.com
      port: 443
      path: /connect
      wss: true
      aes_key: njpjvjkgfykgpqpcksvjydvlctgznlnz
      ssl_reject_unauthorized: true
  clients:
    - name: my-laptop
      endpoint: edge
      client_id: alice
      client_secret: alice-secret
      tunnels:
        - name: ssh
          listen: 127.0.0.1:2222
          target_host: 10.0.0.10
          target_port: 22
```

---

## Nginx reverse proxy example

Assumptions:

- Public domain: `tunnel.example.com`
- ws2tcp server listening on: `127.0.0.1:3005`
- `server.ws_path`: `/connect`

Recommended `location` block:

```nginx
location /connect {
    proxy_pass http://127.0.0.1:3005;
    proxy_http_version 1.1;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_buffering off;
}
```

Notes:

- The `location` path must exactly match `server.ws_path`.
- If Nginx is already terminating TLS, ws2tcp server can listen on plain HTTP locally; set `wss: true` on the client side.
- To enforce ACL based on real client IPs, combine with `server.trust_proxy=true` — only do this if you control the upstream proxy.

---

## Commands

```text
ws2tcp run          # run in foreground
ws2tcp install      # register as OS service (kardianos)
ws2tcp uninstall    # deregister
ws2tcp start/stop   # start/stop via OS service manager
ws2tcp status       # current service status
ws2tcp tail         # last 10 log lines + live follow

ws2tcp server …         # server show|enable|disable|update
ws2tcp server-client …  # server-side client identity CRUD
ws2tcp endpoint …       # reusable endpoint CRUD
ws2tcp client …         # client profile CRUD
ws2tcp tunnel …         # tunnel CRUD / global listing
ws2tcp config …     # view / validate / export config
ws2tcp version      # version + build info
```

All commands accept `--home <path>` to override the `WS2TCP_HOME` environment variable.

Logs are written to two destinations by default:

- `logs/ws2tcp.log` (with built-in rotation and retention)
- Process stderr/stdout (for `ws2tcp run`, launchd, systemd, SCM capture)

`app.log_console` defaults to `false`. Only enable it when you explicitly want logs mirrored to stderr/stdout (e.g. foreground debugging); for system service deployments, keep it off and rely on `logs/`.

---

## Architecture

```
       ┌────────────── ws2tcp binary ──────────────┐
       │                                            │
       │  cmd/ (cobra)         internal/service/    │
       │     │                       │              │
       │     └─────────► internal/app/ (Run)        │
       │                       │                    │
       │     ┌─────────────────┼───────────────────┐│
       │     ▼                 ▼                   ▼│
       │ internal/api/   internal/services/  internal/core/
       │ (gin REST + WS) (registry/runtime/   (server, client,
       │     │            auth/ACL/listen)     wsproxy, crypto,
       │     ▼                                  frame)
       │ internal/web/                                │
       │ (embed.FS for SPA)                           │
       │                                              │
       └──────────────────────────────────────────────┘
```

- **`internal/core/server`** handles WS upgrade, handshake validation, replay protection, target dial, and the streamUp frame.
- **`internal/core/client`** listens for local TCP connections; each accepted connection opens a dedicated WebSocket and bridges after the server's streamUp.
- **`internal/core/wsproxy`** bidirectional `io.Copy` with clean close classification (EOF / EPIPE / ECONNRESET / "use of closed connection" are not logged as warnings).
- **`internal/services/registry`** lock-free hot path via `atomic.Pointer[snapshot]`; writes go through `Apply`; established connections hold the old snapshot and are never partially updated.
- **`internal/services/events`** in-process event bus broadcasting all slog entries, tunnel state changes, and connection counts.
- **`internal/web/embed.go`** placeholder by default; `internal/web/embed_ui.go` (`//go:build embedui`) actually `//go:embed` the SPA — `make build` includes this tag.

Detailed design docs are in `docs/design/`.

---

## Development

```bash
# backend + placeholder UI (visiting / returns "UI not built" page)
make run

# in a second terminal: start vite (port 5266), /api proxied to 7321
make ui-dev
```

```bash
make test            # unit tests (fast)
make test-e2e        # in-process end-to-end: real server+client+tunnel, byte round-trip through echo target
make ui-typecheck    # frontend type check
make ui-lint         # frontend lint
```

GitHub Actions runs tests, frontend checks, and a release build validation on every `push` / `pull_request`. Pushing a `v*` tag (e.g. `v0.1.0`) triggers GoReleaser: publishes a GitHub Release with multi-platform artifacts and auto-generated changelog, and commits the updated Homebrew cask to the tap.

To skip CI for a commit, include `[skip ci]` in the commit message:

```bash
git commit -m "docs: fix typo [skip ci]"
```

Local release dry-run:

```bash
make release-check
make release-snapshot
```

The `HOMEBREW_TAP_GITHUB_TOKEN` repository secret must be set to a token with write access to `HobaiRiku/homebrew-tap` for the tap update to work.

---

## Legacy Node.js implementation

`legacy/` retains the original Node implementation (`client.mjs` + `server.mjs`) as a wire-format reference only. Active development is on the Go binary: single process for both roles, embedded management UI, service integration, and an e2e test suite.

The frame format (handshake + streamUp + e2e encrypted chunks) is compatible with the Node version; as long as both sides share the same `aes_key`, old and new implementations interoperate.

---

## License

[MIT License](LICENSE) © 2026 HobaiRiku
