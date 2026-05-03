package client

// Tunnel manager: each tunnel owns a local TCP listener; per-connection it
// dials the remote ws2tcp-server endpoint, waits for streamUp, then bridges
// via wsproxy. 20s ping handled by coder/websocket. One client process can
// run N tunnels concurrently. See docs/design/03-client-tunnel-manager.md.
// TODO.
