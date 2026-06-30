//go:build !windows

// Package privilege provides helpers for detecting and acquiring elevated
// operating-system permissions needed for system-scope service management.
package privilege

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"syscall"

	"websocket2Tcp/internal/paths"
)

// IsRoot reports whether the current process has root (uid 0) privileges.
func IsRoot() bool {
	return os.Getuid() == 0
}

// NeedsRoot reports whether scope requires root/superuser privileges.
// Only the system scope requires elevation; user-scope operations run as
// the current user.
func NeedsRoot(scope string) bool {
	return scope == paths.ScopeSystem
}

// EnsurePrivilege checks that the current process has the privileges required
// for scope. If not, it attempts to re-execute the binary under sudo,
// replacing the current process image via syscall.Exec. If sudo is not
// available or the re-exec fails, a friendly error is returned.
//
// args should be os.Args[1:] so the re-executed sudo call carries all flags.
func EnsurePrivilege(scope string, args []string) error {
	if !NeedsRoot(scope) || IsRoot() {
		return nil
	}

	sudo, err := exec.LookPath("sudo")
	if err != nil {
		return fmt.Errorf(
			"system-scope operations require root; run with sudo:\n  sudo %s",
			strings.Join(os.Args, " "),
		)
	}

	self, err := os.Executable()
	if err != nil {
		return fmt.Errorf("resolve executable path: %w", err)
	}

	// Build the new argv: ["sudo", "<self>", ...original args...]
	newArgv := make([]string, 0, len(args)+2)
	newArgv = append(newArgv, "sudo", self)
	newArgv = append(newArgv, args...)

	// syscall.Exec replaces the current process image on success and never
	// returns; defensive error handling below covers the exec-failure path.
	if execErr := syscall.Exec(sudo, newArgv, os.Environ()); execErr != nil {
		return fmt.Errorf("exec sudo: %w", execErr)
	}
	// unreachable
	return nil
}
