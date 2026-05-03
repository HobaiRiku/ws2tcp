package crypto

// EncryptStream / DecryptStream as io.Reader / io.Writer wrappers.
// Wire format (must match legacy/utils/aes.mjs):
//   uint16 BE length | 16B IV | ciphertext
//   maxChunkSize = 32768 - 16 - 1
// TODO.
