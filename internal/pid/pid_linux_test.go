//go:build linux

package pid

import (
	"os"
	"path/filepath"
	"testing"
)

func TestProcMatchesPidFileRejectsOlderPIDFileForRunningProcess(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "ws2tcp.pid")

	if err := Write(path, os.Getpid()); err != nil {
		t.Fatalf("Write: %v", err)
	}

	procStart, ok := procStartTime(os.Getpid())
	if !ok || procStart.IsZero() {
		t.Skip("proc start time unavailable")
	}

	oldTime := procStart.Add(-2 * bootTimeSkewGrace)
	if err := os.Chtimes(path, oldTime, oldTime); err != nil {
		t.Fatalf("Chtimes: %v", err)
	}

	if procMatchesPidFile(os.Getpid(), path) {
		t.Fatal("expected stale pid file to be rejected for a reused PID check")
	}
}
