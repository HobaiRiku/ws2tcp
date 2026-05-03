// Package frame defines control-plane frames that ride the WS connection
// alongside data. Currently only streamUp.
//
// streamUp on the wire is sent as base64( AesEncrypt(StreamUpBytes, sharedAESKey) ).
// The bytes themselves follow the layout below — byte-compatible with
// legacy/utils/aes.mjs createStreamUpFrame / parseStreamUpFrame:
//
//	[0x01][0x01][mode]          — 3-byte header
//	mode = 0x01 -> plain (no body)
//	mode = 0x02 -> encrypted, body = 32-byte endToEndKey
package frame

import (
	"errors"
	"fmt"
)

// StreamUpKeySize is the size of the end-to-end key carried in encrypted
// streamUp frames.
const StreamUpKeySize = 32

// LegacyTextStreamUp is the pre-framed plaintext fallback that older Node
// servers used. The Go client must accept it for one release, then we drop
// the workaround. See docs/design/00-overview.md "Wire compatibility".
const LegacyTextStreamUp = "streamUp"

// StreamUp is the decoded form of a streamUp control frame.
type StreamUp struct {
	UseEncryption bool
	// EndToEndKey is set iff UseEncryption is true; length is StreamUpKeySize.
	EndToEndKey []byte
}

// EncodeStreamUp builds the raw frame bytes (NOT yet wrapped with the
// shared AES key — callers do that when sending on the wire).
//
// When useEncryption is false, key is ignored and the result is exactly
// 3 bytes. When true, key MUST be StreamUpKeySize bytes.
func EncodeStreamUp(useEncryption bool, key []byte) ([]byte, error) {
	if !useEncryption {
		return []byte{0x01, 0x01, 0x01}, nil
	}
	if len(key) != StreamUpKeySize {
		return nil, fmt.Errorf("end-to-end key must be %d bytes, got %d", StreamUpKeySize, len(key))
	}
	out := make([]byte, 3+StreamUpKeySize)
	out[0] = 0x01
	out[1] = 0x01
	out[2] = 0x02
	copy(out[3:], key)
	return out, nil
}

// DecodeStreamUp parses the raw bytes produced by EncodeStreamUp. Callers
// pass the AES-decrypted payload (i.e. the result of AesDecrypt over the
// WS message). Length is validated; errors are descriptive.
func DecodeStreamUp(raw []byte) (StreamUp, error) {
	if len(raw) < 3 {
		return StreamUp{}, errors.New("streamUp frame too short")
	}
	if raw[0] != 0x01 || raw[1] != 0x01 {
		return StreamUp{}, fmt.Errorf("invalid streamUp magic: % x", raw[:2])
	}
	switch raw[2] {
	case 0x01:
		return StreamUp{UseEncryption: false}, nil
	case 0x02:
		if len(raw) < 3+StreamUpKeySize {
			return StreamUp{}, fmt.Errorf("encrypted streamUp truncated: have %d bytes, want %d",
				len(raw), 3+StreamUpKeySize)
		}
		key := make([]byte, StreamUpKeySize)
		copy(key, raw[3:3+StreamUpKeySize])
		return StreamUp{UseEncryption: true, EndToEndKey: key}, nil
	default:
		return StreamUp{}, fmt.Errorf("unknown streamUp mode 0x%02x", raw[2])
	}
}

// IsLegacyTextStreamUp reports whether msg is the legacy plaintext "streamUp"
// fallback. Use before attempting AesDecrypt + DecodeStreamUp.
func IsLegacyTextStreamUp(msg []byte) bool {
	return string(msg) == LegacyTextStreamUp
}
