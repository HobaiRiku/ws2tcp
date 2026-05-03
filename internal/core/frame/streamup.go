package frame

// streamUp control frame encode/decode. Header [0x01,0x01,mode]:
//   mode 0x01 — plain
//   mode 0x02 — encrypted, followed by 32B endToEndKey
// Frame itself is AES-encrypted with the shared aesKey on the wire.
// Decoder also accepts legacy plaintext "streamUp" string for one release.
// TODO.
