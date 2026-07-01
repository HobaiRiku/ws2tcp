package pid

import (
	"errors"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"testing"

	"websocket2Tcp/internal/paths"
)

func TestWriteRead(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	if err := Write(path, 12345); err != nil {
		t.Fatalf("Write: %v", err)
	}

	got, err := Read(path)
	if err != nil {
		t.Fatalf("Read: %v", err)
	}
	if got != 12345 {
		t.Fatalf("Read = %d, want 12345", got)
	}
}

func TestWriteCreatesParentDir(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "nested", "deep", "ws2tcp.pid")

	if err := Write(path, os.Getpid()); err != nil {
		t.Fatalf("Write into non-existent dir: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Fatalf("pid file not created: %v", err)
	}
}

func TestWriteIsAtomic(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	// Write twice; second write should succeed and not leave a .tmp file.
	_ = Write(path, 1)
	if err := Write(path, 2); err != nil {
		t.Fatalf("second Write: %v", err)
	}
	if _, err := os.Stat(path + ".tmp"); !os.IsNotExist(err) {
		t.Fatal("stale .tmp file left behind")
	}
	got, _ := Read(path)
	if got != 2 {
		t.Fatalf("after second write Read = %d, want 2", got)
	}
}

func TestReadMissing(t *testing.T) {
	_, err := Read(filepath.Join(t.TempDir(), "no.pid"))
	if err == nil {
		t.Fatal("expected error for missing file")
	}
}

func TestReadInvalid(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "bad.pid")
	_ = os.WriteFile(path, []byte("not-a-number\n"), 0o600)
	_, err := Read(path)
	if err == nil {
		t.Fatal("expected error for non-numeric content")
	}
}

func TestReadZero(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "zero.pid")
	_ = os.WriteFile(path, []byte("0\n"), 0o600)
	_, err := Read(path)
	if err == nil {
		t.Fatal("expected error for pid=0")
	}
}

func TestIsAlive_self(t *testing.T) {
	if !IsAlive(os.Getpid()) {
		t.Fatal("current process should be alive")
	}
}

func TestIsAlive_dead(t *testing.T) {
	// Use an absurdly large PID that no real process can hold.
	if IsAlive(999999999) {
		t.Fatal("PID 999999999 should not be alive")
	}
}

func TestAcquire_fresh(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	if err := Acquire(path); err != nil {
		t.Fatalf("Acquire on empty dir: %v", err)
	}
	defer Release(path)

	got, err := Read(path)
	if err != nil {
		t.Fatalf("Read after Acquire: %v", err)
	}
	if got != os.Getpid() {
		t.Fatalf("PID in file = %d, want %d", got, os.Getpid())
	}
}

func TestAcquire_stale(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	// Write a PID that is definitely not running.
	_ = Write(path, 999999999)

	if err := Acquire(path); err != nil {
		t.Fatalf("Acquire over stale pid should succeed: %v", err)
	}
	defer Release(path)

	got, _ := Read(path)
	if got != os.Getpid() {
		t.Fatalf("expected own PID after overwriting stale, got %d", got)
	}
}

func TestAcquire_busy(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	// Write our own PID as if another copy already holds the lock.
	_ = Write(path, os.Getpid())

	err := Acquire(path)
	if err == nil {
		t.Fatal("expected ErrAlreadyRunning")
	}
	var alreadyRunning ErrAlreadyRunning
	if !errors.As(err, &alreadyRunning) {
		t.Fatalf("expected ErrAlreadyRunning, got %T: %v", err, err)
	}
	if alreadyRunning.PID != os.Getpid() {
		t.Fatalf("ErrAlreadyRunning.PID = %d, want %d", alreadyRunning.PID, os.Getpid())
	}
}

func TestRelease(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	_ = Write(path, os.Getpid())
	Release(path)

	if _, err := os.Stat(path); !os.IsNotExist(err) {
		t.Fatal("pid file should be removed after Release")
	}

	// Double-release must not panic.
	Release(path)
}

func TestPath(t *testing.T) {
	got := Path("/some/home")
	want := filepath.Join("/some/home", "ws2tcp.pid")
	if got != want {
		t.Fatalf("Path = %q, want %q", got, want)
	}
}

func TestErrAlreadyRunning_message(t *testing.T) {
	err := ErrAlreadyRunning{PID: 42, Home: "/tmp/ws2tcp", PIDFile: "/tmp/ws2tcp/ws2tcp.pid"}
	msg := err.Error()
	for _, want := range []string{
		strconv.Itoa(42),
		"/tmp/ws2tcp",
		"/tmp/ws2tcp/ws2tcp.pid",
	} {
		if !contains(msg, want) {
			t.Errorf("error message missing %q:\n%s", want, msg)
		}
	}
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && (s == sub || len(s) > 0 && findSubstring(s, sub))
}

func findSubstring(s, sub string) bool {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}

func TestKnownHomes(t *testing.T) {
	// With an empty system home and no WS2TCP_HOME set, user home should appear.
	t.Setenv("WS2TCP_HOME", "")
	homes := KnownHomes("/system/home")
	if len(homes) == 0 {
		t.Fatal("KnownHomes returned empty slice")
	}
	// system home must be present
	found := false
	for _, h := range homes {
		if h == "/system/home" {
			found = true
		}
	}
	if !found {
		t.Fatalf("system home not in KnownHomes result: %v", homes)
	}
}

func TestKnownHomes_WS2TCPHome(t *testing.T) {
	customHome := t.TempDir()
	t.Setenv("WS2TCP_HOME", customHome)
	homes := KnownHomes("/system/home")
	if homes[0] != customHome {
		t.Fatalf("WS2TCP_HOME should be first in KnownHomes, got %v", homes)
	}
}

func TestKnownHomes_noDuplicates(t *testing.T) {
	// If WS2TCP_HOME equals the system home, no duplicates.
	t.Setenv("WS2TCP_HOME", "/system/home")
	homes := KnownHomes("/system/home")
	seen := map[string]int{}
	for _, h := range homes {
		seen[h]++
	}
	for h, count := range seen {
		if count > 1 {
			t.Fatalf("duplicate home %q in KnownHomes: %v", h, homes)
		}
	}
}

func TestPIDFileModes(t *testing.T) {
	t.Run("default stays private", func(t *testing.T) {
		dir := t.TempDir()
		dm, fm := pidFileModes(filepath.Join(dir, "ws2tcp.pid"))
		if dm != 0o700 || fm != 0o600 {
			t.Fatalf("pidFileModes() = (%o,%o), want (0700,0600)", dm, fm)
		}
	})

	t.Run("darwin system home allows admin group", func(t *testing.T) {
		dm, fm := pidFileModes(filepath.Join(paths.SystemHome(), "ws2tcp.pid"))
		if runtime.GOOS == "darwin" {
			if dm != 0o770 || fm != 0o660 {
				t.Fatalf("pidFileModes() = (%o,%o), want (0770,0660)", dm, fm)
			}
			return
		}
		if dm != 0o700 || fm != 0o600 {
			t.Fatalf("pidFileModes() = (%o,%o), want (0700,0600)", dm, fm)
		}
	})
}
