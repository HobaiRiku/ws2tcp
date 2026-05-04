# ws2tcp rewrite tracker

## Done

1. Service lifecycle CLI (`install`, `uninstall`, `start`, `stop`, `status`)
2. Client CLI (`endpoint show|set`, `tunnels list|add|update|rm`)
3. Server CLI (`clients list|add|update|rm`, `acl set`)
4. Core config CLI (`show`, `path`, `set`, `client-auth set`)
5. Base management REST router in `internal/api`
6. Management API wired into `internal/app` with loopback-only interim auth guard

## Left to do

1. Finish `api-rest`
   - implement token auth middleware and token-backed authorization
   - add any remaining REST endpoints needed by runtime/UI
2. `api-events`
   - management-plane SSE / WebSocket event stream
3. `web-embed`
   - embed SPA assets and add SPA fallback handler
4. `tests-interop`
   - Go↔Node interop fixtures after legacy payload capture is available
