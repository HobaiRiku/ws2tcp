package server

// Client IP resolution. trustProxy=true: X-Forwarded-For[0] -> X-Real-IP ->
// socket. trustProxy=false: socket only. Port of legacy/server.mjs getClientIp.
// TODO.
