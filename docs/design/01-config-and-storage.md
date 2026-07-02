# Config & Storage

## Root directory

Resolution order (first hit wins):

1. `--home <path>` flag on the root cobra command
2. `WS2TCP_HOME` environment variable
3. scope-based default:
   - **system scope** (the default on every platform): the platform system
     data dir — `/var/lib/ws2tcp` (Linux), `/Library/Application Support/ws2tcp`
     (macOS), `%ProgramData%\ws2tcp` (Windows)
   - **user scope** (opt-in via `--user`, not available on Windows):
     `$HOME/.ws2tcp`

We deliberately do **not** use `xdg.ConfigHome` / `xdg.DataHome` as the
primary location. The project's design point is "one human-editable
folder you can `tar` and move"; XDG split paths fight that. `xdg` is
imported only as a last-resort fallback if `$HOME` is empty (rare,
mainly headless service contexts).

On startup the binary creates and `chmod 0700`s the tree (file mode
`0600`):

```
~/.ws2tcp/
├── config.yaml          # main config; everything below is derived
├── certs/               # optional sslCert/sslKey for native wss
│   ├── cert.pem
│   └── key.pem
├── data/
│   └── runtime.json     # last-known runtime state, written on shutdown (advisory only)
└── logs/
    └── ws2tcp.log       # slog JSON, daily rotation via lumberjack-style writer
```

## YAML schema

Single `config.yaml`. A complete annotated example:

```yaml
# ~/.ws2tcp/config.yaml

app:
  # Bind address for the management HTTP server (API + Web UI).
  # Default loopback-only; set "0.0.0.0:7321" deliberately to expose.
  http_listen: "127.0.0.1:7321"
  # When true, the management API requires a Bearer token from app.http_token.
  # Setting false is only honored when http_listen is loopback.
  http_auth: true
  http_token: change-me-management-token
  log_level: info               # debug|info|warn|error

# ─────────────────────── server role ───────────────────────
server:
  listen: "0.0.0.0:3005"        # ws/wss bind
  ws_path: /connect
  ws_host: example.com          # optional Host header gate; "" disables
  trust_proxy: false            # honor X-Forwarded-For / X-Real-IP

  aes_key: "njpjvjkgfykgpqpcksvjydvlctgznlnz"  # 32 bytes
  use_encryption: true          # end-to-end AES on data plane

  tls:
    enabled: false
    cert: certs/cert.pem        # paths are resolved relative to WS2TCP_HOME
    key:  certs/key.pem

  # Server-side identities. See 02-server-acl-auth.md for ACL semantics.
  clients:
    - id: test1
      secret: test1
      # ACL: list of allowed (cidr, ports) pairs. Empty list = deny all targets.
      # Each port entry is a single port "22" or a range "8000-8999".
      acl:
        - cidr: 192.168.1.0/24
          ports: ["22", "80", "443"]
        - cidr: 10.0.0.0/8
          ports: ["3306", "6379", "8000-8999"]

# ─────────────────────── client role ───────────────────────
client:
  endpoints:
    - name: prod-ws
      host: ws.example.com      # used for SNI + Host header; ip is optional dial override
      ip:   ""
      port: 3005
      path: /connect
      wss:  false
      aes_key: "njpjvjkgfykgpqpcksvjydvlctgznlnz"
      ssl_reject_unauthorized: false

  clients:
    - name: prod
      endpoint: prod-ws
      client_id: test1
      client_secret: test1
      tunnels:
        - name: ssh-prod
          listen: "127.0.0.1:2000"
          target_host: 192.168.1.192
          target_port: 22

        - name: mysql-stage
          listen: "127.0.0.1:3307"
          target_host: 10.0.0.5
          target_port: 3306
```

Schema-level notes:

- **`client.endpoints[].name` must be unique** and is referenced by
  `client.clients[].endpoint`.
- **`client.clients[].name` must be unique**; each client profile owns
  its own credentials and tunnel set.
- Editing an endpoint resets only the tunnels that reference it.
- `aes_key` length is validated at load time (must be exactly 32 bytes
  to match AES-256-CBC); we surface a clear error rather than panicking
  at first encryption.
- ACL `ports` strings are parsed once at load and cached as a
  `[]portRange{lo, hi}` for O(rules) match.
- We rely on YAML's plain scalar rules carefully: `aes_key` is always
  quoted (it can start with characters YAML would otherwise interpret)
  and listen addresses are always quoted (`"0.0.0.0:3005"`) to avoid
  the colon being parsed as a mapping.

## Management token

The management API uses one fixed Bearer token stored in
`app.http_token`. Rotate it by editing `config.yaml`.

When `app.http_auth: false` *and* `app.http_listen` resolves to a
loopback address, the API skips token checks. Any non-loopback bind
forces `http_auth: true` regardless of config.

## Loading & writing

- **Load path** (`internal/config`): viper reads `config.yaml`,
  unmarshals into typed structs, runs validators (`validate.Struct`
  via `go-playground/validator` — small enough dep, optional; can be
  hand-rolled). `Defaults()` fills missing fields exactly the way the
  Node implementation defaults today (`use_encryption: true`,
  `trust_proxy: false`, `ssl_reject_unauthorized: false`, etc.).
- **Write path** (CLI/API edits): we don't round-trip through viper
  (it loses comments/ordering). Instead the `services.Config` mutator
  uses `gopkg.in/yaml.v3`'s `*yaml.Node` API to load → mutate → write
  the file atomically (`os.WriteFile` to `config.yaml.tmp`,
  `os.Rename`). `yaml.v3` preserves comments and key order on the
  unchanged parts of the document, which keeps the file pleasant to
  diff in version control. Other goroutines pick up the change via
  the reload channel below.

## Reload semantics

Hot reload via fsnotify on `config.yaml`:

| Section changed                    | Effect |
|------------------------------------|--------|
| `app.http_listen` / `http_auth`    | restart HTTP server |
| `app.log_level`                    | live, no restart |
| `server.*`                         | restart server subsystem (drains existing connections) |
| `server.clients[*]` add/remove/edit | live: cached user table swapped atomically; **existing connections continue**, but their ACL is re-checked on next dial within the same tunnel — see 02 |
| `client.endpoints[*]` edit         | reset tunnels that reference the edited endpoint |
| `client.clients[*]` add/remove     | spin up or tear down that client's tunnels |
| `client.clients[*].endpoint` edit  | reset every tunnel owned by that client |
| `client.clients[*].tunnels[*]` add | spin up new tunnel only |
| `client.clients[*].tunnels[*]` edit/remove | reset that tunnel only (its sub-ctx cancelled, then rebuilt) |

The "reset only its own connections" property is what lets the Web UI
feel responsive — see [03](./03-client-tunnel-manager.md).
