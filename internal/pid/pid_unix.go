//go:build !windows

package pid

import (
	"errors"
	"os"
	"syscall"
)

// IsAlive reports whether the process identified by pid is running.
// EPERM (permission denied to signal) is treated as "alive" — the process
// exists but belongs to a different user.
func IsAlive(pid int) bool {
	proc, err := os.FindProcess(pid)
	if err != nil {
		return false
	}
	err = proc.Signal(syscall.Signal(0))
	return err == nil || errors.Is(err, syscall.EPERM)
}
