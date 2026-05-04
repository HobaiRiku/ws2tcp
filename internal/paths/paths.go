// Package paths resolves the WS2TCP_HOME root and the file/directory layout
// described in docs/design/01-config-and-storage.md.
//
// Resolution order (first hit wins):
//  1. explicit override (the --home flag passed to the root cobra command)
//  2. WS2TCP_HOME environment variable
//  3. $HOME/.ws2tcp (or %USERPROFILE%\.ws2tcp on Windows)
package paths

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

const (
	defaultDirName = ".ws2tcp"
	envHome        = "WS2TCP_HOME"

	subCerts = "certs"
	subData  = "data"
	subLogs  = "logs"

	fileConfig = "config.yaml"
	fileLog    = "ws2tcp.log" // lives under logs/

	dirMode  os.FileMode = 0o700
	fileMode os.FileMode = 0o600
)

// Paths holds the resolved absolute root and offers helpers for the
// well-known sub-locations. Construct via Resolve.
type Paths struct {
	Home string
}

// Resolve returns Paths honoring the precedence above. override may be empty.
func Resolve(override string) (Paths, error) {
	home, err := pickHome(override)
	if err != nil {
		return Paths{}, err
	}
	abs, err := filepath.Abs(home)
	if err != nil {
		return Paths{}, fmt.Errorf("resolve home %q: %w", home, err)
	}
	return Paths{Home: abs}, nil
}

func pickHome(override string) (string, error) {
	if override != "" {
		return override, nil
	}
	if env := os.Getenv(envHome); env != "" {
		return env, nil
	}
	h, err := os.UserHomeDir()
	if err != nil || h == "" {
		return "", errors.New("cannot determine user home; set WS2TCP_HOME or pass --home")
	}
	return filepath.Join(h, defaultDirName), nil
}

// EnsureTree creates Home, certs/, data/, logs/ with mode 0700, idempotent.
// Files inside (config.yaml, log file) are created lazily by their respective
// writers with mode 0600.
func (p Paths) EnsureTree() error {
	for _, d := range []string{p.Home, p.Certs(), p.Data(), p.Logs()} {
		if err := os.MkdirAll(d, dirMode); err != nil {
			return fmt.Errorf("mkdir %s: %w", d, err)
		}
		// Re-chmod even if MkdirAll did nothing, to repair permissions when
		// a user restored the tree from an archive with looser modes.
		if err := os.Chmod(d, dirMode); err != nil {
			return fmt.Errorf("chmod %s: %w", d, err)
		}
	}
	return nil
}

// Certs is the directory for optional sslCert/sslKey used by native wss.
func (p Paths) Certs() string { return filepath.Join(p.Home, subCerts) }

// Data holds other small persisted runtime state.
func (p Paths) Data() string { return filepath.Join(p.Home, subData) }

// Logs holds ws2tcp.log and rotation siblings.
func (p Paths) Logs() string { return filepath.Join(p.Home, subLogs) }

// Config returns the absolute path to config.yaml.
func (p Paths) Config() string { return filepath.Join(p.Home, fileConfig) }

// LogFile returns the absolute path to logs/ws2tcp.log.
func (p Paths) LogFile() string { return filepath.Join(p.Logs(), fileLog) }

// FileMode is the canonical mode for files created under Home.
func (p Paths) FileMode() os.FileMode { return fileMode }

// ResolveRelative joins rel onto Home unless rel is already absolute.
// Empty rel returns "" so callers can distinguish "unset" from "set to home".
func (p Paths) ResolveRelative(rel string) string {
	if rel == "" {
		return ""
	}
	if filepath.IsAbs(rel) {
		return rel
	}
	return filepath.Join(p.Home, rel)
}
