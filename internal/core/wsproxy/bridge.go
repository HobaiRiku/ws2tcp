package wsproxy

// Generic bridge: pipes net.Conn <-> net.Conn with optional EncryptStream /
// DecryptStream layered in. Both server (after auth+dial) and client (after
// streamUp) call into this — replaces today's wsStream.pipe(socket) chain.
// TODO.
