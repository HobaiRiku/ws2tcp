package service

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"websocket2Tcp/internal/paths"
)

// macOS launchd helpers. kardianos/service still drives `launchctl load -w`,
// which is the legacy API and emits the famously vague "Input/output error"
// whenever launchd has any stale cached state for the same label (common when
// switching between system daemon and user agent installs). These wrappers use
// the modern bootstrap/bootout/kickstart API so install is self-healing and
// start/stop don't fail on cache mismatches.
//
// Scope determines the launchd domain:
//   - user  → gui/<uid>      (LaunchAgent in ~/Library/LaunchAgents)
//   - system → system/       (LaunchDaemon in /Library/LaunchDaemons)

func darwinDomain(scope string) string {
	if scope == paths.ScopeSystem {
		return "system"
	}
	if sudoUID := os.Getenv("SUDO_UID"); sudoUID != "" {
		if uid, err := strconv.Atoi(sudoUID); err == nil && uid >= 0 {
			return fmt.Sprintf("gui/%d", uid)
		}
	}
	return fmt.Sprintf("gui/%d", os.Getuid())
}

func darwinServiceTarget(scope string) string {
	return fmt.Sprintf("%s/%s", darwinDomain(scope), serviceName)
}

func darwinPlistPath(scope string) (string, error) {
	if scope == paths.ScopeSystem {
		return filepath.Join("/Library", "LaunchDaemons", serviceName+".plist"), nil
	}
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, "Library", "LaunchAgents", serviceName+".plist"), nil
}

func darwinBootout(scope string) {
	// Idempotent best-effort: ignore "service not found" — we just want to
	// guarantee any stale registration is gone.
	_ = exec.Command("launchctl", "bootout", darwinServiceTarget(scope)).Run()
}

func darwinBootstrap(scope string) error {
	plist, err := darwinPlistPath(scope)
	if err != nil {
		return fmt.Errorf("locate plist: %w", err)
	}
	out, err := exec.Command("launchctl", "bootstrap", darwinDomain(scope), plist).CombinedOutput()
	if err != nil {
		return fmt.Errorf("launchctl bootstrap: %s: %w", strings.TrimSpace(string(out)), err)
	}
	return nil
}

func darwinKickstart(scope string) (bool, error) {
	out, err := exec.Command("launchctl", "kickstart", darwinServiceTarget(scope)).CombinedOutput()
	if err != nil {
		return true, fmt.Errorf("launchctl kickstart: %s: %w", strings.TrimSpace(string(out)), err)
	}
	return true, nil
}

func darwinKill(scope string) (bool, error) {
	out, err := exec.Command("launchctl", "kill", "SIGTERM", darwinServiceTarget(scope)).CombinedOutput()
	if err != nil {
		return true, fmt.Errorf("launchctl kill: %s: %w", strings.TrimSpace(string(out)), err)
	}
	return true, nil
}
