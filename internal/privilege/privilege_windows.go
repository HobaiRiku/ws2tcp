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

	"websocket2Tcp/internal/paths"
)

// IsRoot reports whether the current process is running with administrator
// privileges (elevated token).
func IsRoot() bool {
	var token syscall.Token
	// GetCurrentProcess() always returns the constant pseudo-handle -1;
	// syscall.CurrentProcess() doesn't exist in Go's syscall package.
	proc := syscall.Handle(^uintptr(0))
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
	return scope == paths.ScopeSystem
}

// EnsurePrivilege checks that the current process has the privileges required
// for scope. On Windows, automatic UAC elevation is not performed from a
// console application; a clear instructional error is returned instead.
func EnsurePrivilege(scope string, args []string) error {
	if !NeedsRoot(scope) || IsRoot() {
		return nil
	}
	// Display os.Args[0] separately to avoid misleading output for paths with spaces.
	return fmt.Errorf(
		"system-scope operations require administrator privileges\n"+
			"Right-click the terminal and select 'Run as administrator', then retry:\n  %s %s",
		os.Args[0], strings.Join(args, " "),
	)
}
