package crypto

import (
	"bytes"
	"io"
	"testing"
)

const testKey = "njpjvjkgfykgpqpcksvjydvlctgznlnz"

func TestAesEncryptRoundTrip(t *testing.T) {
	ct, err := AesEncrypt([]byte("hello world"), []byte(testKey))
	if err != nil {
		t.Fatal(err)
	}
	pt, err := AesDecrypt([]byte(ct), []byte(testKey))
	if err != nil {
		t.Fatal(err)
	}
	if string(pt) != "hello world" {
		t.Fatalf("got %q", pt)
	}
}

func TestAesDecryptKnownNodeOutput(t *testing.T) {
	// Captured from the legacy Node implementation:
	//   aesEncrypt(Buffer.from('cmd:secret:host:22:abc'), key) ->
	//   "<base64 below>". Re-encryption isn't deterministic (random IV)
	//   so we can only check decrypt-direction with a captured value.
	// To regenerate: run the snippet under legacy/ and paste the output.
	//
	// We skip if no fixture is set so this file stays portable for now.
	t.Skip("placeholder for cross-impl interop fixture (TODO: capture)")
}

func TestAesDecryptRejectsBadKeyLength(t *testing.T) {
	_, err := AesDecrypt([]byte("ignored"), []byte("short"))
	if err == nil {
		t.Fatal("want error on short key")
	}
}

func TestStreamRoundTripSmall(t *testing.T) {
	var buf bytes.Buffer
	w, err := NewEncryptWriter(&buf, []byte(testKey))
	if err != nil {
		t.Fatal(err)
	}
	in := []byte("the quick brown fox jumps over the lazy dog")
	if _, err := w.Write(in); err != nil {
		t.Fatal(err)
	}

	r, err := NewDecryptReader(&buf, []byte(testKey))
	if err != nil {
		t.Fatal(err)
	}
	out, err := io.ReadAll(io.LimitReader(r, int64(len(in))))
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(in, out) {
		t.Fatalf("mismatch:\n in: %q\nout: %q", in, out)
	}
}

func TestStreamMultiChunk(t *testing.T) {
	// Force chunking by writing > MaxChunkSize.
	in := bytes.Repeat([]byte{0xAB}, MaxChunkSize*2+123)

	var buf bytes.Buffer
	w, err := NewEncryptWriter(&buf, []byte(testKey))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := w.Write(in); err != nil {
		t.Fatal(err)
	}

	r, err := NewDecryptReader(&buf, []byte(testKey))
	if err != nil {
		t.Fatal(err)
	}
	out := make([]byte, 0, len(in))
	tmp := make([]byte, 4096)
	for len(out) < len(in) {
		n, err := r.Read(tmp)
		if n > 0 {
			out = append(out, tmp[:n]...)
		}
		if err == io.EOF && len(out) == len(in) {
			break
		}
		if err != nil && err != io.EOF {
			t.Fatal(err)
		}
	}
	if !bytes.Equal(in, out) {
		t.Fatalf("multi-chunk mismatch (len in=%d, out=%d)", len(in), len(out))
	}
}

func TestPkcs7Roundtrip(t *testing.T) {
	for _, n := range []int{0, 1, 15, 16, 17, 31, 32, 33, 100} {
		data := bytes.Repeat([]byte{0xCD}, n)
		padded := pkcs7Pad(data, BlockSize)
		if len(padded)%BlockSize != 0 {
			t.Errorf("n=%d not block-aligned", n)
		}
		out, err := pkcs7Unpad(padded, BlockSize)
		if err != nil {
			t.Errorf("n=%d: %v", n, err)
			continue
		}
		if !bytes.Equal(data, out) {
			t.Errorf("n=%d roundtrip mismatch", n)
		}
	}
}
