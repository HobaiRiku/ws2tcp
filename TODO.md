# ws2tcp rewrite tracker

## Done

1. Service lifecycle CLI (`install`, `uninstall`, `start`, `stop`, `status`)
2. Client CLI (`endpoint show|set`, `tunnels list|add|update|rm`)
3. Server CLI (`clients list|add|update|rm`, `acl set`)
4. Core config CLI (`show`, `path`, `set`, `client-auth set`)
5. Base management REST router in `internal/api`
6. Management API wired into `internal/app`
7. Client model refactored to named `endpoints[]` plus named `clients[]`, with each client owning its own credentials and tunnels
8. Finished `api-rest`
   - added persisted argon2id token auth + scope-aware middleware
   - added token CRUD, runtime stats, client inventory, and config replace endpoints
9. Finished `api-events`
   - added shared in-process event bus plus `/api/events/stream` and `/api/events/ws`
   - published `tunnel.state` and `server.conn.*` runtime events from the client/server data plane

## Left to do

1. `web-embed`
   - embed SPA assets and add SPA fallback handler
2. `tests-interop`
   - Go↔Node interop fixtures after legacy payload capture is available
