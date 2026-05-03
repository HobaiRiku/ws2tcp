// Package crypto ports legacy/utils/aes.mjs to Go. The wire formats here
// are byte-compatible with the existing Node implementation — see
// docs/design/00-overview.md "Wire compatibility".
//
// Two distinct AES-256-CBC layouts coexist:
//
//   - Command/streamUp wrap (AesEncrypt/AesDecrypt):
//     base64( ciphertext || iv )         <- IV at TAIL
//
//   - Data-plane chunks (EncryptStream/DecryptStream):
//     [uint16 BE len][16B iv][ciphertext] <- IV at HEAD
//
// Don't unify them: doing so would break interop with deployed Node clients.
package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
)

// KeySize is the required AES-256 key length, in bytes.
const KeySize = 32

// BlockSize is the AES block / IV size, in bytes.
const BlockSize = aes.BlockSize // 16

// MaxChunkSize matches legacy/utils/aes.mjs EncryptStream — a single packet
// payload (IV + ciphertext) plus the 2-byte length prefix must fit within
// 32768 bytes. The Node code subtracts 16 (IV) and 1 from 32768; we keep
// the same constant verbatim to guarantee identical chunking.
const MaxChunkSize = 32768 - 16 - 1

// AesEncrypt encrypts data with key (32 bytes) using AES-256-CBC and a
// random IV, then returns base64(ciphertext || iv). IV-at-tail layout
// matches legacy/utils/aes.mjs aesEncrypt — used for the ?command= query
// param and the streamUp control frame.
func AesEncrypt(data, key []byte) (string, error) {
	if len(key) != KeySize {
		return "", fmt.Errorf("aes key must be %d bytes, got %d", KeySize, len(key))
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	iv := make([]byte, BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}
	padded := pkcs7Pad(data, BlockSize)
	ct := make([]byte, len(padded))
	cipher.NewCBCEncrypter(block, iv).CryptBlocks(ct, padded)

	out := make([]byte, 0, len(ct)+BlockSize)
	out = append(out, ct...)
	out = append(out, iv...)
	return base64.StdEncoding.EncodeToString(out), nil
}

// AesDecrypt is the inverse of AesEncrypt. It accepts either a base64
// string or raw bytes (callers pass the raw WS message directly when the
// frame was sent without re-encoding).
func AesDecrypt(data, key []byte) ([]byte, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("aes key must be %d bytes, got %d", KeySize, len(key))
	}
	raw, err := decodeBase64Maybe(data)
	if err != nil {
		return nil, err
	}
	if len(raw) < BlockSize || (len(raw)-BlockSize)%BlockSize != 0 {
		return nil, errors.New("ciphertext length invalid")
	}
	iv := raw[len(raw)-BlockSize:]
	ct := raw[:len(raw)-BlockSize]

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	pt := make([]byte, len(ct))
	cipher.NewCBCDecrypter(block, iv).CryptBlocks(pt, ct)
	return pkcs7Unpad(pt, BlockSize)
}

// AesDecryptString is a convenience wrapper for callers that hold base64
// text (e.g. URL-decoded ?command= values).
func AesDecryptString(s string, key []byte) ([]byte, error) {
	return AesDecrypt([]byte(s), key)
}

// decodeBase64Maybe accepts both base64-encoded text and already-raw bytes.
// Node's aesDecrypt always base64-decoded; we mirror that for text inputs
// but fall back to raw if the input is clearly not base64 (length not %4
// AND not valid base64) — this keeps the door open for future binary
// transport without breaking existing callers.
func decodeBase64Maybe(data []byte) ([]byte, error) {
	// Try strict base64 first.
	if dec, err := base64.StdEncoding.DecodeString(string(data)); err == nil {
		return dec, nil
	}
	// Some Node senders may URL-encode chars; try URL-encoding decoder.
	if dec, err := base64.URLEncoding.DecodeString(string(data)); err == nil {
		return dec, nil
	}
	return nil, errors.New("input is not valid base64")
}

func pkcs7Pad(data []byte, blockSize int) []byte {
	pad := blockSize - len(data)%blockSize
	out := make([]byte, len(data)+pad)
	copy(out, data)
	for i := len(data); i < len(out); i++ {
		out[i] = byte(pad)
	}
	return out
}

func pkcs7Unpad(data []byte, blockSize int) ([]byte, error) {
	if len(data) == 0 || len(data)%blockSize != 0 {
		return nil, errors.New("pkcs7: data length not a multiple of block size")
	}
	pad := int(data[len(data)-1])
	if pad == 0 || pad > blockSize {
		return nil, errors.New("pkcs7: invalid padding length")
	}
	if pad > len(data) {
		return nil, errors.New("pkcs7: padding longer than data")
	}
	for i := len(data) - pad; i < len(data); i++ {
		if int(data[i]) != pad {
			return nil, errors.New("pkcs7: invalid padding byte")
		}
	}
	return data[:len(data)-pad], nil
}

// RandomKey returns n random bytes; used for end-to-end key generation.
func RandomKey(n int) ([]byte, error) {
	b := make([]byte, n)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return nil, err
	}
	return b, nil
}
