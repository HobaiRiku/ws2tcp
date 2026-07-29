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
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"websocket2Tcp/internal/paths"
)

var bootTimeNow = newBootTimeReader(systemBootTime)

const bootTimeSkewGrace = time.Second

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
//
// The implementation uses O_EXCL to narrow the TOCTOU race: at most one
// concurrent starter will successfully create the file. If the file exists
// but belongs to a dead process it is removed once and the creation is
// retried, giving the surviving caller the lock.
func Acquire(path string) error {
	dirPerm, filePerm := pidFileModes(path)
	if err := os.MkdirAll(filepath.Dir(path), dirPerm); err != nil {
		return fmt.Errorf("create pid dir: %w", err)
	}

	f, err := os.OpenFile(path, os.O_CREATE|os.O_EXCL|os.O_WRONLY, filePerm)
	if err != nil {
		if !os.IsExist(err) {
			return fmt.Errorf("acquire pid lock: %w", err)
		}
		// Check for a pre-boot pid file before reading it so a rebooted host can
		// recover even if the file contents are truncated or otherwise unreadable.
		if pidFilePredatesCurrentBoot(path) {
			return acquireAfterStaleRemoval(path, filePerm)
		}
		// File already exists — check whether the recorded process is alive.
		existing, readErr := Read(path)
		if readErr == nil && IsAlive(existing) {
			return ErrAlreadyRunning{
				PID:     existing,
				Home:    filepath.Dir(path),
				PIDFile: path,
			}
		}
		// Stale entry: remove and try once more with O_EXCL so that a
		// concurrent starter that also detected the stale file loses the race.
		return acquireAfterStaleRemoval(path, filePerm)
	}

	_, writeErr := fmt.Fprintf(f, "%d\n", os.Getpid())
	_ = f.Close()
	return writeErr
}

// Release removes the PID file. Ignores not-exist errors; intended for
// deferred cleanup.
func Release(path string) {
	Remove(path)
}

// Write atomically writes pid to path with ws2tcp's platform/scoped mode.
// Parent directories are created if they do not exist.
func Write(path string, pid int) error {
	dirPerm, filePerm := pidFileModes(path)
	if err := os.MkdirAll(filepath.Dir(path), dirPerm); err != nil {
		return fmt.Errorf("create pid dir: %w", err)
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, []byte(strconv.Itoa(pid)+"\n"), filePerm); err != nil {
		return fmt.Errorf("write pid: %w", err)
	}
	if err := os.Rename(tmp, path); err != nil {
		_ = os.Remove(tmp)
		return fmt.Errorf("install pid file: %w", err)
	}
	return nil
}

func pidFileModes(path string) (os.FileMode, os.FileMode) {
	if runtime.GOOS == "darwin" && filepath.Clean(filepath.Dir(path)) == filepath.Clean(paths.SystemHome()) {
		return 0o770, 0o660
	}
	return 0o700, 0o600
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

func newBootTimeReader(read func() time.Time) func() time.Time {
	var mu sync.Mutex
	var cached time.Time
	return func() time.Time {
		mu.Lock()
		defer mu.Unlock()
		if cached.IsZero() {
			cached = read()
		}
		return cached
	}
}

func acquireAfterStaleRemoval(path string, filePerm os.FileMode) error {
	_ = os.Remove(path)
	f, err := os.OpenFile(path, os.O_CREATE|os.O_EXCL|os.O_WRONLY, filePerm)
	if err != nil {
		return fmt.Errorf("acquire pid lock after stale removal: %w", err)
	}
	_, writeErr := fmt.Fprintf(f, "%d\n", os.Getpid())
	_ = f.Close()
	return writeErr
}

func pidFilePredatesCurrentBoot(path string) bool {
	boot := bootTimeNow()
	if boot.IsZero() {
		// Unsupported platforms fall back to the legacy "PID is alive" check.
		return false
	}
	info, err := os.Stat(path)
	if err != nil {
		return false
	}
	modTime := info.ModTime()
	if modTime.IsZero() {
		return false
	}
	// Only classify files that are safely older than the reported boot time.
	// This tolerates small boot-time rounding/estimation errors without
	// misclassifying a freshly-written post-boot pid file as stale.
	return modTime.Before(boot.Add(-bootTimeSkewGrace))
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
