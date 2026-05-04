# Web UI

Stack: **Vue 3** (Composition API + `<script setup>`) + **Vite** +
**Microsoft Fluent UI Web Components** (`@fluentui/web-components`).
Built artifact in `ui/dist/` is embedded into the binary via the build
pipeline and copied into `internal/web/static/`.

## Why Fluent Web Components with Vue 3

Fluent UI Web Components are framework-agnostic custom elements. Vue 3
treats unknown tags as custom elements when configured, so we get
Fluent's design language without pulling in React. Vue handles state
and routing; Fluent handles widgets.

Vite config exposes them:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [
    vue({
      template: { compilerOptions: { isCustomElement: t => t.startsWith('fluent-') } },
    }),
  ],
})
```

`main.ts` calls `provideFluentDesignSystem().register(allComponents)`
once.

## Pages

Kept intentionally small. Six views map 1:1 to API resources:

1. **Dashboard** — counts of running tunnels, server connections,
   recent errors, byte throughput sparklines.
2. **Server / Identities** — table of server clients. Inline ACL
   editor: each row expands into a CIDR + port-ranges table.
3. **Server / Connections** — live list, kick action, filter by client
   id / source IP.
4. **Client / Endpoint** — one shared upstream server config editor
   (HOST:PORT, WSS, AES key, TLS verify). Saving resets live tunnels so
   new connections use the new upstream settings.
5. **Client / Tunnels** — table with columns NAME, STATE, LISTEN,
   TARGET, CONNS. Create/edit dialog only asks for tunnel-local fields,
   since the client endpoint is configured separately once.
6. **Settings** — `app:` block, fixed management token guidance, and
   `config.yaml` raw editor (Monaco) for power users; saving validates
   server-side via `PUT /api/config`.

## Frontend ↔ backend contract

- The OpenAPI for the API is generated from Go structs (`swaggo` or a
  small in-tree generator) and committed at `ui/openapi.json`. The
  frontend uses it for typed clients via `openapi-typescript`. Keeping
  the schema generated avoids hand-maintaining DTOs.
- Live updates have two transports under `/api/events` (see
  [04](./04-api-cli-shared-service.md)): SSE for the lightweight
  state/metric topics, and a WebSocket for log tailing. The UI client
  picks the WS endpoint when the user opens the Logs panel, SSE
  otherwise. Both flow through the same `services/events` bus, so the
  Vue store stays oblivious to the transport.

## Build & embed

`Makefile`:

```make
web:
	cd ui && pnpm install && pnpm build

build: web
	go build -tags release -ldflags "$(LDFLAGS)" -o dist/ws2tcp ./

dev:
	# foreground daemon + vite dev with API proxy
	WS2TCP_HOME=$(PWD)/.dev go run . run &
	cd ui && pnpm dev
```

In dev mode the SPA is served by Vite at `:5173` and proxies `/api/*`
to `:7321`. In release mode the gin engine serves `/` from the
embedded FS via `gin.WrapH(http.FileServer(...))`, with an
`index.html` SPA fallback for unknown paths registered through a
`NoRoute` handler.

## What's intentionally *not* here

- No SSR. The app is a localhost-first admin panel; SSR adds
  complexity for no win.
- No charting library beyond a small inline sparkline component —
  this is a tunnel manager, not a metrics dashboard.
- No i18n in v1; strings are English. Fluent UI itself is locale-aware
  for things like date formatting; we rely on browser locale.
