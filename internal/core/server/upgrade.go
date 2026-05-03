package server

// HTTP -> WebSocket upgrade. Validates wsPath, optional wsHost, runs auth,
// then dials targetHost:targetPort and emits the streamUp frame. Port of
// legacy/server.mjs upgrade handler. TODO.
