package wsproxy

import (
	"bytes"
	"context"
	"io"
	"net"
	"testing"
	"time"
)

const k32 = "njpjvjkgfykgpqpcksvjydvlctgznlnz"

// pair returns two connected net.Conn endpoints.
func pair() (net.Conn, net.Conn) { return net.Pipe() }

func TestBridgePlain(t *testing.T) {
	wsA, wsB := pair()
	tcpA, tcpB := pair()

	go func() {
		_ = Bridge(context.Background(), wsB, tcpB, false, nil)
	}()

	// Write on the "client" tcp end -> should appear on the WS peer.
	go func() {
		_, _ = tcpA.Write([]byte("ping"))
		_ = tcpA.Close()
	}()
	got, err := io.ReadAll(wsA)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(got, []byte("ping")) {
		t.Fatalf("got %q", got)
	}
}

func TestBridgeEncryptedRoundTrip(t *testing.T) {
	wsA, wsB := pair()
	tcpA, tcpB := pair()

	bridgeDone := make(chan struct{})
	go func() {
		defer close(bridgeDone)
		_ = Bridge(context.Background(), wsB, tcpB, true, []byte(k32))
	}()

	// Send plaintext on tcp side; on wsA we should observe the encrypted
	// packet stream. Send it back through Bridge on a *symmetric* second
	// bridge to round-trip — easier: just verify decrypt path explicitly.
	// For this test, the simpler check is: write tcp -> read back the
	// raw packets on wsA, then feed those packets into a DecryptReader
	// and assert plaintext.
	go func() {
		_, _ = tcpA.Write([]byte("hello encrypted"))
		_ = tcpA.Close()
	}()

	// Read ciphertext until EOF on wsA.
	cipherbuf, err := io.ReadAll(wsA)
	if err != nil {
		t.Fatal(err)
	}
	if len(cipherbuf) == 0 {
		t.Fatal("no encrypted data observed")
	}

	// The bridge wraps tcp->ws in EncryptWriter; decrypt and compare.
	dec, err := newDecrypt(t, cipherbuf)
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(dec, []byte("hello encrypted")) {
		t.Fatalf("decrypted = %q", dec)
	}

	select {
	case <-bridgeDone:
	case <-time.After(time.Second):
		t.Fatal("bridge did not exit")
	}
}

func TestBridgeContextCancel(t *testing.T) {
	wsA, wsB := pair()
	tcpA, tcpB := pair()
	defer wsA.Close()
	defer tcpA.Close()

	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan error, 1)
	go func() { done <- Bridge(ctx, wsB, tcpB, false, nil) }()

	cancel()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("Bridge did not return after ctx cancel")
	}
}

// newDecrypt mirrors the Bridge encrypted-side decode for assertions.
func newDecrypt(t *testing.T, raw []byte) ([]byte, error) {
	t.Helper()
	r := bytes.NewReader(raw)
	dr, err := newDecryptReader(r)
	if err != nil {
		return nil, err
	}
	return io.ReadAll(dr)
}
