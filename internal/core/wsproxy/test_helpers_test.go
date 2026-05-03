package wsproxy

import (
	"io"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/core/crypto"
)

func newDecryptReader(r io.Reader) (io.Reader, error) {
	return crypto.NewDecryptReader(r, []byte(k32))
}
