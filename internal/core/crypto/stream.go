package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
)

// EncryptWriter wraps an io.Writer and emits the same packet layout as
// legacy/utils/aes.mjs EncryptStream:
//
//	[uint16 BE length][16B IV][AES-256-CBC ciphertext]
//
// where length covers IV + ciphertext (NOT including the length prefix).
// Each Write may produce multiple packets if its size exceeds MaxChunkSize.
type EncryptWriter struct {
	w     io.Writer
	block cipher.Block
}

// NewEncryptWriter builds an EncryptWriter using key (32 bytes).
func NewEncryptWriter(w io.Writer, key []byte) (*EncryptWriter, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("aes key must be %d bytes, got %d", KeySize, len(key))
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	return &EncryptWriter{w: w, block: block}, nil
}

// Write encrypts p and emits one or more packets to the underlying writer.
// Returns the original len(p) on success (the underlying writer consumes
// more bytes than that, but the io.Writer contract is about the input).
func (e *EncryptWriter) Write(p []byte) (int, error) {
	written := 0
	for written < len(p) {
		end := written + MaxChunkSize
		if end > len(p) {
			end = len(p)
		}
		if err := e.writeChunk(p[written:end]); err != nil {
			return written, err
		}
		written = end
	}
	return written, nil
}

func (e *EncryptWriter) writeChunk(chunk []byte) error {
	iv := make([]byte, BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return err
	}
	padded := pkcs7Pad(chunk, BlockSize)
	ct := make([]byte, len(padded))
	cipher.NewCBCEncrypter(e.block, iv).CryptBlocks(ct, padded)

	pkt := make([]byte, 2+BlockSize+len(ct))
	binary.BigEndian.PutUint16(pkt[:2], uint16(BlockSize+len(ct)))
	copy(pkt[2:2+BlockSize], iv)
	copy(pkt[2+BlockSize:], ct)

	_, err := e.w.Write(pkt)
	return err
}

// DecryptReader is the inverse of EncryptWriter. It reads from the
// underlying io.Reader, buffering partial packets until a full
// length-prefixed frame is available, then decrypts and returns the
// plaintext to the caller.
type DecryptReader struct {
	r       io.Reader
	block   cipher.Block
	buf     []byte // unread plaintext spillover from a previous decrypt
	bufOff  int    // offset into buf for next Read
	scratch []byte // reusable network read buffer
}

// NewDecryptReader builds a DecryptReader using key (32 bytes).
func NewDecryptReader(r io.Reader, key []byte) (*DecryptReader, error) {
	if len(key) != KeySize {
		return nil, fmt.Errorf("aes key must be %d bytes, got %d", KeySize, len(key))
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	return &DecryptReader{
		r:       r,
		block:   block,
		scratch: make([]byte, 0, 4096),
	}, nil
}

// Read returns plaintext bytes; it may decode multiple packets internally
// per call. EOF on the underlying reader is propagated only after any
// fully-decoded plaintext has been delivered.
func (d *DecryptReader) Read(p []byte) (int, error) {
	if d.bufOff < len(d.buf) {
		n := copy(p, d.buf[d.bufOff:])
		d.bufOff += n
		if d.bufOff == len(d.buf) {
			d.buf = d.buf[:0]
			d.bufOff = 0
		}
		return n, nil
	}

	pt, err := d.readPacket()
	if pt != nil {
		n := copy(p, pt)
		if n < len(pt) {
			d.buf = append(d.buf[:0], pt[n:]...)
			d.bufOff = 0
		}
		return n, nil
	}
	return 0, err
}

// readPacket pulls one full packet off the wire and decrypts it.
func (d *DecryptReader) readPacket() ([]byte, error) {
	var lenBuf [2]byte
	if _, err := io.ReadFull(d.r, lenBuf[:]); err != nil {
		return nil, err
	}
	n := int(binary.BigEndian.Uint16(lenBuf[:]))
	if n < BlockSize+BlockSize { // IV + at least one ciphertext block
		return nil, errors.New("decrypt: packet too small")
	}
	pkt := make([]byte, n)
	if _, err := io.ReadFull(d.r, pkt); err != nil {
		return nil, err
	}
	iv := pkt[:BlockSize]
	ct := pkt[BlockSize:]
	if len(ct)%BlockSize != 0 {
		return nil, errors.New("decrypt: ciphertext not block-aligned")
	}
	pt := make([]byte, len(ct))
	cipher.NewCBCDecrypter(d.block, iv).CryptBlocks(pt, ct)
	return pkcs7Unpad(pt, BlockSize)
}
