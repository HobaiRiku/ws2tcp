package frame

import (
	"bytes"
	"testing"
)

func TestEncodePlain(t *testing.T) {
	got, err := EncodeStreamUp(false, nil)
	if err != nil {
		t.Fatal(err)
	}
	want := []byte{0x01, 0x01, 0x01}
	if !bytes.Equal(got, want) {
		t.Fatalf("got % x, want % x", got, want)
	}
}

func TestEncodeEncrypted(t *testing.T) {
	key := bytes.Repeat([]byte{0xAB}, StreamUpKeySize)
	got, err := EncodeStreamUp(true, key)
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 3+StreamUpKeySize {
		t.Fatalf("len = %d, want %d", len(got), 3+StreamUpKeySize)
	}
	if got[0] != 0x01 || got[1] != 0x01 || got[2] != 0x02 {
		t.Fatalf("bad header: % x", got[:3])
	}
	if !bytes.Equal(got[3:], key) {
		t.Fatal("key body mismatch")
	}
}

func TestEncodeEncryptedRejectsBadKey(t *testing.T) {
	if _, err := EncodeStreamUp(true, []byte{1, 2, 3}); err == nil {
		t.Fatal("want error on short key")
	}
}

func TestDecodeRoundTrip(t *testing.T) {
	key := bytes.Repeat([]byte{0xCD}, StreamUpKeySize)
	for _, useEnc := range []bool{false, true} {
		raw, err := EncodeStreamUp(useEnc, key)
		if err != nil {
			t.Fatal(err)
		}
		dec, err := DecodeStreamUp(raw)
		if err != nil {
			t.Fatal(err)
		}
		if dec.UseEncryption != useEnc {
			t.Errorf("UseEncryption: got %v, want %v", dec.UseEncryption, useEnc)
		}
		if useEnc && !bytes.Equal(dec.EndToEndKey, key) {
			t.Errorf("key roundtrip mismatch")
		}
		if !useEnc && dec.EndToEndKey != nil {
			t.Errorf("plain decode should leave key nil, got %v", dec.EndToEndKey)
		}
	}
}

func TestDecodeRejectsBadMagic(t *testing.T) {
	if _, err := DecodeStreamUp([]byte{0x02, 0x01, 0x01}); err == nil {
		t.Fatal("want magic error")
	}
}

func TestDecodeRejectsTruncatedEncrypted(t *testing.T) {
	if _, err := DecodeStreamUp([]byte{0x01, 0x01, 0x02, 0x01, 0x02}); err == nil {
		t.Fatal("want truncation error")
	}
}

func TestLegacyTextStreamUp(t *testing.T) {
	if !IsLegacyTextStreamUp([]byte("streamUp")) {
		t.Fatal("legacy text not recognised")
	}
	if IsLegacyTextStreamUp([]byte("not it")) {
		t.Fatal("false positive")
	}
}
