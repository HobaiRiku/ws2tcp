//go:build windows

package pid

import (
	"syscall"
)

const (
	processQueryLimitedInformation = 0x1000
	stillActive                    = 259 // STILL_ACTIVE exit code
)

// IsAlive reports whether the process identified by pid is running.
// Uses OpenProcess + GetExitCodeProcess so it works correctly even for
// processes we didn't spawn ourselves.
func IsAlive(pid int) bool {
	handle, err := syscall.OpenProcess(processQueryLimitedInformation, false, uint32(pid))
	if err != nil {
		// ERROR_INVALID_PARAMETER → no such process
		return false
	}
	defer syscall.CloseHandle(handle)

	var exitCode uint32
	if err := syscall.GetExitCodeProcess(handle, &exitCode); err != nil {
		return false // can't determine exit status; treat as not alive (fail-safe)
	}
	return exitCode == stillActive
}
