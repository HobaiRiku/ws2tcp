package server

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/core/crypto"
)

// HandshakeCommand is the parsed form of the AES-encrypted ?command= query
// param: clientId:clientSecret:targetHost:targetPort:clientConnectionId.
type HandshakeCommand struct {
	ClientID     string
	ClientSecret string
	TargetHost   string
	TargetPort   uint16
	ConnID       string
}

// ErrAuthFailed is returned by ParseCommand on any decode/parse failure.
// Upgrade handlers convert it into a 401 without leaking specifics.
var ErrAuthFailed = errors.New("auth failed")

// ParseCommand base64-decodes, AES-decrypts, and splits the command query
// value using sharedKey (32 bytes). The caller is expected to have already
// URL-decoded cmd (e.g. via r.URL.Query().Get("command") which decodes for
// us). Errors are wrapped under ErrAuthFailed so callers can reject the
// upgrade with a single 401.
func ParseCommand(cmd string, sharedKey []byte) (HandshakeCommand, error) {
	if cmd == "" {
		return HandshakeCommand{}, fmt.Errorf("%w: empty command", ErrAuthFailed)
	}
	plain, err := crypto.AesDecryptString(cmd, sharedKey)
	if err != nil {
		return HandshakeCommand{}, fmt.Errorf("%w: aes-decrypt: %v", ErrAuthFailed, err)
	}
	parts := strings.Split(string(plain), ":")
	if len(parts) != 5 {
		return HandshakeCommand{}, fmt.Errorf("%w: expected 5 fields, got %d", ErrAuthFailed, len(parts))
	}
	port, err := strconv.Atoi(parts[3])
	if err != nil || port <= 0 || port > 65535 {
		return HandshakeCommand{}, fmt.Errorf("%w: bad target port %q", ErrAuthFailed, parts[3])
	}
	return HandshakeCommand{
		ClientID:     parts[0],
		ClientSecret: parts[1],
		TargetHost:   parts[2],
		TargetPort:   uint16(port),
		ConnID:       parts[4],
	}, nil
}
