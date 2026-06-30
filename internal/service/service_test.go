package service

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	kservice "github.com/kardianos/service"
)

func TestProgramStartStopLifecycle(t *testing.T) {
	// Use a real temp dir so the PID file can be written.
	home := t.TempDir()

	started := make(chan struct{})
	stopped := make(chan struct{})

	p := &Program{
		home: home,
		run: func(ctx context.Context, gotHome string, console bool) error {
			if gotHome != home {
				t.Errorf("home = %q, want %q", gotHome, home)
			}
			if console {
				t.Error("service run should disable console logging")
			}
			close(started)
			<-ctx.Done()
			close(stopped)
			return nil
		},
	}

	if err := p.Start(nil); err != nil {
		t.Fatalf("Start() error = %v", err)
	}

	select {
	case <-started:
	case <-time.After(2 * time.Second):
		t.Fatal("program did not start")
	}

	// Second Start must fail (PID file is held by first Start).
	if err := p.Start(nil); err == nil {
		t.Fatal("second Start() unexpectedly succeeded")
	}

	if err := p.Stop(nil); err != nil {
		t.Fatalf("Stop() error = %v", err)
	}

	select {
	case <-stopped:
	case <-time.After(2 * time.Second):
		t.Fatal("program did not stop")
	}

	// After Stop, PID file must be removed.
	if _, err := os.Stat(filepath.Join(home, "ws2tcp.pid")); !os.IsNotExist(err) {
		t.Fatal("pid file should be removed after Stop")
	}
}

func TestProgramStopWithoutStart(t *testing.T) {
	p := NewProgram("")
	if err := p.Stop(nil); err != nil {
		t.Fatalf("Stop() error = %v", err)
	}
}

func TestStatusString(t *testing.T) {
	tests := map[kservice.Status]string{
		kservice.StatusRunning: "running",
		kservice.StatusStopped: "stopped",
		kservice.StatusUnknown: "unknown",
	}

	for status, want := range tests {
		if got := StatusString(status); got != want {
			t.Fatalf("StatusString(%v) = %q, want %q", status, got, want)
		}
	}
}

func TestLoadOptionsInitializesMissingConfig(t *testing.T) {
	home := t.TempDir()

	opts, closer, err := loadOptions(home, true)
	if err != nil {
		t.Fatal(err)
	}
	defer closer.Close()

	// Init writes a randomly-generated token; just sanity check it looks
	// like real entropy (long enough, not the historical placeholder).
	tok := opts.Config.App.HTTPToken
	if tok == "" || tok == "change-me-management-token" || len(tok) < 32 {
		t.Fatalf("unexpected initialized token: %q", tok)
	}
	if _, err := os.Stat(filepath.Join(home, "config.yaml")); err != nil {
		t.Fatalf("expected initialized config file: %v", err)
	}
}
