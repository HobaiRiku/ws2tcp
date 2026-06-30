//go:build windows

package services

import (
	"syscall"
)

// isAddrInUse reports whether err indicates that the requested address/port is
// already bound by another process (WSAEADDRINUSE on Windows).
func isAddrInUse(err error) bool {
	return isErrno(err, syscall.WSAEADDRINUSE)
}
