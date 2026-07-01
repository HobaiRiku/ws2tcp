# Build & Testing

Two concerns kept in one doc because they share the Makefile surface:
local build/dev workflow, and what we expect each tier of test to
cover.

## Makefile

Single source of truth for local development. CI invokes the same
targets — no parallel scripts. Frontend-related GitHub Actions jobs pin
Node 24 together with `pnpm@9.15.0` so local and CI installs resolve
the same lockfile consistently.

```make
# ─── variables ────────────────────────────────────────────────────────
GO            := go
PNPM          := pnpm
APP           := ws2tcp
PKG           := ./...
BIN_DIR       := dist
UI_DIR        := ui
UI_DIST       := $(UI_DIR)/dist

VERSION       ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
COMMIT        := $(shell git rev-parse --short HEAD 2>/dev/null || echo none)
BUILD_TIME    := $(shell date -u +%Y-%m-%dT%H:%M:%SZ)
LDFLAGS       := -s -w \
                 -X 'main.version=$(VERSION)' \
                 -X 'main.commit=$(COMMIT)' \
                 -X 'main.buildTime=$(BUILD_TIME)'

GOTESTSUM     := go run gotest.tools/gotestsum@latest
GOLANGCI_LINT := go run github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# ─── developer convenience ────────────────────────────────────────────
.PHONY: help
help:                            ## list targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | sort | \
		awk -F':.*?## ' '{printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

.PHONY: tidy
tidy:                            ## go mod tidy
	$(GO) mod tidy

.PHONY: fmt
fmt:                             ## gofmt + goimports
	$(GO) fmt $(PKG)

.PHONY: lint
lint:                            ## staticcheck + revive via golangci-lint
	$(GOLANGCI_LINT) run

# ─── frontend ─────────────────────────────────────────────────────────
.PHONY: ui-install
ui-install:
	cd $(UI_DIR) && $(PNPM) install --frozen-lockfile

.PHONY: ui
ui: ui-install                   ## build embedded SPA
	cd $(UI_DIR) && $(PNPM) build

.PHONY: ui-dev
ui-dev: ui-install               ## vite dev server with API proxy
	cd $(UI_DIR) && $(PNPM) dev

# ─── backend build ────────────────────────────────────────────────────
.PHONY: build
build: web                       ## release build (single binary, embedded SPA)
	$(GO) build -tags release -trimpath -ldflags "$(LDFLAGS)" \
	    -o $(BIN_DIR)/$(APP) ./

.PHONY: build-nogui
build-nogui:                     ## quick backend-only build (empty embed FS)
	$(GO) build -tags nowebui -ldflags "$(LDFLAGS)" \
	    -o $(BIN_DIR)/$(APP) ./

# ─── run ──────────────────────────────────────────────────────────────
.PHONY: run
run: build-nogui                 ## foreground daemon w/ ./.dev as WS2TCP_HOME
	WS2TCP_HOME=$(PWD)/.dev $(BIN_DIR)/$(APP) run

.PHONY: dev
dev:                             ## backend + vite together (two terminals recommended)
	@echo "Run 'make run' in one shell and 'make ui-dev' in another."

# ─── tests ────────────────────────────────────────────────────────────
.PHONY: test
test: test-unit test-service     ## fast tests (no network, no binary spawn)

.PHONY: test-unit
test-unit:                       ## pure unit tests under internal/core/...
	$(GOTESTSUM) -- -race -count=1 ./internal/core/...

.PHONY: test-service
test-service:                    ## services-layer tests against tmp WS2TCP_HOME
	$(GOTESTSUM) -- -race -count=1 ./internal/services/... ./internal/api/...

.PHONY: test-e2e
test-e2e: build-nogui            ## spawns the binary, real sockets
	$(GOTESTSUM) -- -count=1 -tags=e2e -timeout 120s ./tests/e2e/...

.PHONY: test-interop
test-interop: build-nogui        ## Go binary against the Node legacy implementation
	$(GOTESTSUM) -- -count=1 -tags=interop ./tests/interop/...

.PHONY: test-all
test-all: test test-e2e test-interop

.PHONY: cover
cover:
	$(GO) test -race -coverprofile=cover.out -covermode=atomic ./internal/...
	$(GO) tool cover -html=cover.out -o cover.html

# ─── release ──────────────────────────────────────────────────────────
.PHONY: release
release: web                     ## cross-build via goreleaser
	goreleaser release --clean

.PHONY: snapshot
snapshot: web
	goreleaser release --clean --snapshot --skip=publish

.PHONY: clean
clean:
	rm -rf $(BIN_DIR) $(WEB_DIST) cover.out cover.html .dev
```

Notes:

- `build-nogui` swaps the embedded SPA for an empty FS via the
  `nowebui` build tag — turnaround for a backend change is a sub-second
  `go build`. Release builds always go through `make build` so the
  artifact is always self-contained.
- Tools used during build (`gotestsum`, `golangci-lint`, `goreleaser`)
  are pinned at invocation via `go run pkg@version` rather than
  installed globally; no contributor setup required.
- `make help` is the discoverability surface — every public target has
  a `##` doc comment.

## Test strategy

Three tiers, ordered cheapest first. `make test` runs the first two
on every commit; the rest are CI-only or pre-release.

### 1. Unit tests — `internal/core/...`

Goal: protocol-level correctness, isolated from config/http/runtime.

What they cover:

- `core/crypto` — AES round-trip parity vs. fixed test vectors
  (committed under `internal/core/crypto/testdata/`). One vector is
  literally captured from the existing Node `aesEncrypt(...)` output
  to prove byte-for-byte compatibility.
- `core/frame` — `streamUp` encode/decode, including the legacy
  plaintext `"streamUp"` fallback the new client must accept.
- `core/wsproxy` — bidirectional `io.Copy` bridge driven by two
  in-memory `net.Pipe()` halves; injects errors mid-stream and asserts
  both sides close cleanly.
- `core/server/auth` — table-driven tests for the AES command parsing
  + replay reservation + `Allows()` ACL match (CIDR + port range
  edges, multi-A-record DNS, IPv6).

These tests must stay free of `time.Sleep`, fs, sockets, or fork.

### 2. Service tests — `internal/services/...` and `internal/api/...`

Goal: the abstraction layer that CLI and HTTP both depend on does
the right thing, against a real but ephemeral config tree.

Pattern:

```go
func newTestEnv(t *testing.T) *testEnv {
    home := t.TempDir()
    t.Setenv("WS2TCP_HOME", home)
    cfg := config.LoadOrInit(home)
    reg := services.New(cfg, paths.Resolve())
    t.Cleanup(reg.Shutdown)
    return &testEnv{Home: home, Reg: reg}
}
```

What we cover at this tier:

- `Tunnels.Create` appends a new tunnel under a valid `client.endpoint`
  and persists it.
- Editing `client.endpoint` fans out: spin up two tunnels, change the
  shared endpoint's `aes_key`, assert both tunnels reset.
- API tests: same matrix driven through `httptest.NewServer(api.New(reg))`,
  including auth scope enforcement (`server:write` token can't hit
  `client/tunnels`) and the loopback-skip-auth carve-out.
- Config writer round-trip: load → mutate one field via
  shared-client config mutation → reload → assert comments and
  unrelated key order in `config.yaml` are preserved (yaml.v3 Node
  golden file).

These tests run against `t.TempDir()` and in-process fakes — no
binary spawn, no real ws2tcp listener except a small `httptest`-style
fake under `internal/testutil/wsserver` that speaks just enough of
the protocol to validate the handshake.

### 3. End-to-end tests — `tests/e2e/...` (build tag `e2e`)

Goal: the shipped binary, exercised through its real CLI and HTTP
surface, transports actual TCP traffic correctly.

Harness:

```
tests/e2e/
├── harness.go          # spawns ws2tcp run on a random port, returns *Daemon
├── fixtures/
│   └── echo_server.go  # tiny TCP echo server used as the "target"
└── ...
```

`Daemon.Cmd("client", "endpoint", "set", ...)` shells out to the
binary built by `make build-nogui`; it reads stdout JSON when invoked
with `--json`. The harness writes a fresh `WS2TCP_HOME` per test and
deletes it on cleanup.

Scenarios — minimum set for v1:

1. **Smoke**: configure client endpoint + tunnel via CLI, dial the local
   listener, write `hello`, expect `hello` back from the echo server
   on the far side. Asserts encrypted and plaintext modes both work.
2. **Shared-endpoint reload**: two tunnels share one client endpoint.
   `PUT /api/client/endpoint` rotates `aes_key`. Expect both tunnels'
   connections to terminate and reconnect.
3. **ACL deny**: tunnel configured with client `cli1` credentials hits a
   only port 22; tunnel targets port 80; expect upgrade rejected with
   403, structured log captured, daemon stays healthy.
4. **Replay protection**: replay the same `?command=` URL twice
   (force the same `connId` via a test-only flag); second upgrade
   rejected.
5. **Reload**: edit `config.yaml` directly while the daemon is
   running, fsnotify picks up the change, `GET /api/client/tunnels`
   reflects it within 2s.
6. **Token auth**: hit `/api/client/tunnels` without a token on a
   non-loopback bind → 401; with read scope → 200 GET / 403 POST.
7. **Token-over-WS**: connect to `/api/events/ws?token=…`, observe a
   `tunnel.state` event when scenario 1 starts.

Run constraints:

- e2e tests use OS-assigned ports (`:0`) to stay parallel-safe.
- Each test spins its own daemon, so failures are isolated.
- Total budget: under 60s on a developer laptop, hard timeout 120s
  in CI.

### 4. Interop tests — `tests/interop/...` (build tag `interop`)

Goal: protect wire compatibility with the existing Node implementation
for at least one release.

Two configurations:

- Node `server.mjs` ↔ Go `ws2tcp client` tunnel.
- Go `ws2tcp` server ↔ Node `client.mjs`.

The harness re-uses today's `config.client.example.json` /
`config.server.example.json`. Each direction runs the smoke scenario
plus the encrypted-data-frame check.

These tests require Node to be present and are tagged `interop` so
contributors without Node installed aren't blocked.

## CI mapping

| Workflow stage    | Make target                  |
|-------------------|------------------------------|
| `lint`            | `make fmt lint`              |
| `test-fast`       | `make test`                  |
| `test-e2e`        | `make test-e2e`              |
| `test-interop`    | `make test-interop` (only on PRs that touch `internal/core/{crypto,frame,server,client}` or release branches) |
| `release`         | `make release` on tag push   |

## Coverage expectations

- `internal/core/...`: ≥ 85% line coverage. Protocol code is small and
  pure; anything less means missing edge cases.
- `internal/services/...`: ≥ 70%. The 30% slack is the
  fs/atomic-rename and yaml.v3 Node manipulation, where edge coverage
  comes from e2e instead.
- `cmd/...`, `internal/api/handlers/...`: not gated on coverage; the
  service tests already exercise the underlying logic, and these
  layers are intentionally trivial mappers.

A coverage drop of more than 2 points on `internal/core/...` between
two PRs blocks merge.
