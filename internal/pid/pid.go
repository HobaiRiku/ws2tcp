// Package pid provides single-instance locking via a PID file.
//
// Typical usage:
//
//	pidFile := pid.Path(home)
//	if err := pid.Acquire(pidFile); err != nil {
//	    return err  // prints human-readable message if already running
//	}
//	defer pid.Release(pidFile)
package pid

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

// ErrAlreadyRunning is returned by Acquire when a live ws2tcp process is
// already holding the PID file.
type ErrAlreadyRunning struct {
	PID     int
	Home    string
	PIDFile string
}

func (e ErrAlreadyRunning) Error() string {
	return fmt.Sprintf(
		"ws2tcp is already running as PID %d (home: %s)\n"+
			"If the process is stale, delete %s and retry.",
		e.PID, e.Home, e.PIDFile,
	)
}

// Path returns the conventional PID file location inside home.
func Path(home string) string {
	return filepath.Join(home, "ws2tcp.pid")
}

// Acquire writes the current process PID to path. If a live process already
// holds the file, ErrAlreadyRunning is returned. A stale PID (file exists but
// process is dead) is silently overwritten.
func Acquire(path string) error {
	existing, err := Read(path)
	if err == nil && IsAlive(existing) {
		return ErrAlreadyRunning{
			PID:     existing,
			Home:    filepath.Dir(path),
			PIDFile: path,
		}
	}
	return Write(path, os.Getpid())
}

// Release removes the PID file. Ignores not-exist errors; intended for
// deferred cleanup.
func Release(path string) {
	Remove(path)
}

// Write atomically writes pid to path with mode 0600. Parent directories are
// created (mode 0700) if they do not exist.
func Write(path string, pid int) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return fmt.Errorf("create pid dir: %w", err)
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, []byte(strconv.Itoa(pid)+"\n"), 0o600); err != nil {
		return fmt.Errorf("write pid: %w", err)
	}
	if err := os.Rename(tmp, path); err != nil {
		_ = os.Remove(tmp)
		return fmt.Errorf("install pid file: %w", err)
	}
	return nil
}

// Read parses the integer PID from path.
func Read(path string) (int, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return 0, err
	}
	p, err := strconv.Atoi(strings.TrimSpace(string(data)))
	if err != nil {
		return 0, fmt.Errorf("invalid pid file %q: %w", path, err)
	}
	if p <= 0 {
		return 0, fmt.Errorf("invalid pid %d in %q", p, path)
	}
	return p, nil
}

// Remove deletes path, ignoring not-exist errors.
func Remove(path string) {
	_ = os.Remove(path)
}

// KnownHomes returns the set of ws2tcp home directories likely to host a
// PID file: WS2TCP_HOME (if set), the per-user default (~/.ws2tcp), and the
// platform system home. systemHome is passed in by callers that already know
// the platform default (e.g. paths.SystemHome()) to avoid a cross-package
// import cycle.
func KnownHomes(systemHome string) []string {
	seen := map[string]bool{}
	var homes []string
	add := func(h string) {
		if h != "" && !seen[h] {
			seen[h] = true
			homes = append(homes, h)
		}
	}
	add(os.Getenv("WS2TCP_HOME"))
	if h, err := os.UserHomeDir(); err == nil {
		add(filepath.Join(h, ".ws2tcp"))
	}
	add(systemHome)
	return homes
}
