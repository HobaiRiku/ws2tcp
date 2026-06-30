//go:build windows

// Package privilege provides helpers for detecting and acquiring elevated
// operating-system permissions needed for system-scope service management.
package privilege

import (
	"fmt"
	"os"
	"strings"
	"syscall"
	"unsafe"
)

// IsRoot reports whether the current process is running with administrator
// privileges (elevated token).
func IsRoot() bool {
	var token syscall.Token
	proc := syscall.CurrentProcess()
	if err := syscall.OpenProcessToken(proc, syscall.TOKEN_QUERY, &token); err != nil {
		return false
	}
	defer token.Close()

	// TokenElevation = 20; value is a DWORD where non-zero means elevated.
	const tokenElevationType = 20
	var elevation uint32
	var returnLen uint32
	err := syscall.GetTokenInformation(
		token,
		tokenElevationType,
		(*byte)(unsafe.Pointer(&elevation)),
		uint32(unsafe.Sizeof(elevation)),
		&returnLen,
	)
	return err == nil && elevation != 0
}

// NeedsRoot reports whether scope requires administrator privileges.
func NeedsRoot(scope string) bool {
	return scope == "system"
}

// EnsurePrivilege checks that the current process has the privileges required
// for scope. On Windows, automatic UAC elevation is not performed from a
// console application; a clear instructional error is returned instead.
func EnsurePrivilege(scope string, args []string) error {
	if !NeedsRoot(scope) || IsRoot() {
		return nil
	}
	return fmt.Errorf(
		"system-scope operations require administrator privileges\n"+
			"Right-click the terminal and select 'Run as administrator', then retry:\n  %s",
		strings.Join(os.Args, " "),
	)
}
