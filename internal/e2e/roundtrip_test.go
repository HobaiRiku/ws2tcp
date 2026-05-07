//go:build e2e

package e2e

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"io"
	"net"
	"testing"
	"time"
)

// TestE2E_EncryptedRoundtrip writes a randomly-generated 64KB blob into
// the local tunnel listener, expects the same bytes to come back via the
// echo target. Encrypted data plane (server.use_encryption=true).
func TestE2E_EncryptedRoundtrip(t *testing.T) {
	target, stopEcho := startEcho(t)
	defer stopEcho()

	h := startHarness(t, harnessOpts{
		serverPort:    freePort(t),
		tunnelPort:    freePort(t),
		targetAddr:    target,
		useEncryption: true,
	})

	roundtripPayload(t, h, 64*1024)
}

// TestE2E_PlainRoundtrip same as the encrypted case but with the data
// plane in pass-through mode — exercises the alternate Bridge path that
// pipes ws<->tcp directly.
func TestE2E_PlainRoundtrip(t *testing.T) {
	target, stopEcho := startEcho(t)
	defer stopEcho()

	h := startHarness(t, harnessOpts{
		serverPort:    freePort(t),
		tunnelPort:    freePort(t),
		targetAddr:    target,
		useEncryption: false,
	})

	roundtripPayload(t, h, 8*1024)
}

// TestE2E_WrongClientSecretRejected: the client's handshake secret
// doesn't match the server's record. The server must reject the upgrade,
// so the local TCP connection accepted by the tunnel ends up closed
// without ever bridging — no echo data flows back.
func TestE2E_WrongClientSecretRejected(t *testing.T) {
	target, stopEcho := startEcho(t)
	defer stopEcho()

	h := startHarness(t, harnessOpts{
		serverPort:           freePort(t),
		tunnelPort:           freePort(t),
		targetAddr:           target,
		useEncryption:        true,
		clientSecret:         "real-secret",
		overrideClientSecret: "wrong-secret",
	})

	conn, err := net.Dial("tcp", fmt.Sprintf("127.0.0.1:%d", h.opts.tunnelPort))
	if err != nil {
		t.Fatalf("dial tunnel: %v", err)
	}
	defer conn.Close()

	// 写入也许成功 (走 OS buffer), 但读取必须在 server 拒绝后立即 EOF.
	_, _ = conn.Write([]byte("hello"))
	_ = conn.SetReadDeadline(time.Now().Add(3 * time.Second))
	buf := make([]byte, 64)
	n, err := conn.Read(buf)
	if err == nil && n > 0 {
		t.Fatalf("expected no echo (auth should have failed), got %q", buf[:n])
	}
	h.requireLogContainsAll("upgrade denied", `"reason":"auth failed"`)
}

// TestE2E_ACLDeniesTarget: identity exists, secret matches, but the ACL
// on the server side excludes the target host. Server should respond
// 403 to the upgrade and the local conn must drop without bridging.
func TestE2E_ACLDeniesTarget(t *testing.T) {
	target, stopEcho := startEcho(t)
	defer stopEcho()

	h := startHarness(t, harnessOpts{
		serverPort:    freePort(t),
		tunnelPort:    freePort(t),
		targetAddr:    target,
		useEncryption: true,
		denyACL:       true,
	})

	conn, err := net.Dial("tcp", fmt.Sprintf("127.0.0.1:%d", h.opts.tunnelPort))
	if err != nil {
		t.Fatalf("dial tunnel: %v", err)
	}
	defer conn.Close()

	_, _ = conn.Write([]byte("hello"))
	_ = conn.SetReadDeadline(time.Now().Add(3 * time.Second))
	buf := make([]byte, 64)
	n, err := conn.Read(buf)
	if err == nil && n > 0 {
		t.Fatalf("expected ACL to block (no echo), got %q", buf[:n])
	}
	h.requireLogContainsAll("upgrade denied", `"reason":"ACL"`)
}

// roundtripPayload writes random bytes through the tunnel, reads back
// the same number of bytes, and asserts byte-for-byte equality.
func roundtripPayload(t *testing.T, h *harness, size int) {
	t.Helper()

	payload := make([]byte, size)
	if _, err := rand.Read(payload); err != nil {
		t.Fatalf("rand.Read: %v", err)
	}

	conn, err := net.Dial("tcp", fmt.Sprintf("127.0.0.1:%d", h.opts.tunnelPort))
	if err != nil {
		t.Fatalf("dial tunnel: %v", err)
	}
	defer conn.Close()

	_ = conn.SetDeadline(time.Now().Add(15 * time.Second))

	// 用单独 goroutine 写, 避免 echo 服务端 buffer 顶住主线程.
	writeErr := make(chan error, 1)
	go func() {
		_, err := conn.Write(payload)
		writeErr <- err
	}()

	got := make([]byte, len(payload))
	if _, err := io.ReadFull(conn, got); err != nil {
		t.Fatalf("read echo: %v", err)
	}
	if err := <-writeErr; err != nil {
		t.Fatalf("write payload: %v", err)
	}

	if !bytes.Equal(got, payload) {
		t.Fatalf("echo mismatch (size=%d)", size)
	}
}
