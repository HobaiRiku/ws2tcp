// Package wsproxy bridges a WebSocket-as-net.Conn with a TCP net.Conn,
// optionally inserting end-to-end AES-256-CBC packet framing on the WS leg.
//
// This is the Go counterpart to legacy/{server,client}.mjs `wsStream.pipe(socket)`
// chains. Both server (after auth + dial + streamUp) and client (after
// receiving streamUp) call Bridge.
package wsproxy

import (
	"context"
	"errors"
	"io"
	"net"
	"strings"
	"syscall"

	"websocket2Tcp/internal/core/crypto"
)

// Bridge runs bidirectional io.Copy between ws and tcp until either side
// closes, then closes both. When useEncryption is true, the WS leg is
// wrapped in EncryptWriter / DecryptReader keyed by key (32 bytes).
//
// Bridge is synchronous: it returns when both copy goroutines have ended.
// The first non-close error encountered is returned (nil on clean EOF).
//
// Cancelling ctx forces an early teardown by closing both conns; the
// goroutines will exit with use-of-closed-connection errors which are
// classified as "expected close" and suppressed.
func Bridge(ctx context.Context, ws, tcp net.Conn, useEncryption bool, key []byte) error {
	var (
		wsReader io.Reader = ws
		wsWriter io.Writer = ws
	)
	if useEncryption {
		enc, err := crypto.NewEncryptWriter(ws, key)
		if err != nil {
			return err
		}
		dec, err := crypto.NewDecryptReader(ws, key)
		if err != nil {
			return err
		}
		wsReader = dec
		wsWriter = enc
	}

	cancelCtx, cancel := context.WithCancel(ctx)
	defer cancel()
	go func() {
		<-cancelCtx.Done()
		_ = ws.Close()
		_ = tcp.Close()
	}()

	type result struct{ err error }
	done := make(chan result, 2)

	go func() {
		_, err := io.Copy(tcp, wsReader) // ws -> tcp
		_ = tcp.Close()
		done <- result{err}
	}()
	go func() {
		_, err := io.Copy(wsWriter, tcp) // tcp -> ws
		_ = ws.Close()
		done <- result{err}
	}()

	var firstErr error
	for i := 0; i < 2; i++ {
		r := <-done
		if r.err != nil && !isExpectedClose(r.err) && firstErr == nil {
			firstErr = r.err
		}
	}
	return firstErr
}

// isExpectedClose suppresses the family of post-Close errors we get from
// net.Conn / coder/websocket.NetConn when the peer (or our cancel goroutine)
// shuts the conn down mid-copy. EOF / ErrClosedPipe / ErrClosed are the
// usual local-side flavours; ECONNRESET / EPIPE / "broken pipe" are what
// surface when the peer drops first. (*net.TCPConn).ReadFrom uses sendfile
// on linux, so the underlying syscall errno is reachable through errors.Is.
func isExpectedClose(err error) bool {
	if err == nil {
		return true
	}
	if errors.Is(err, io.EOF) ||
		errors.Is(err, io.ErrClosedPipe) ||
		errors.Is(err, net.ErrClosed) ||
		errors.Is(err, syscall.ECONNRESET) ||
		errors.Is(err, syscall.EPIPE) ||
		errors.Is(err, context.Canceled) ||
		errors.Is(err, context.DeadlineExceeded) {
		return true
	}
	// Fallback string match for wrappers that don't carry the underlying
	// syscall errno (e.g. some coder/websocket close frames).
	msg := err.Error()
	switch {
	case strings.Contains(msg, "use of closed network connection"),
		strings.Contains(msg, "connection reset by peer"),
		strings.Contains(msg, "broken pipe"),
		strings.Contains(msg, "websocket: close"):
		return true
	}
	return false
}
