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
	started := make(chan struct{})
	stopped := make(chan struct{})

	p := &Program{
		home: "/tmp/ws2tcp-test",
		run: func(ctx context.Context, home string, console bool) error {
			if home != "/tmp/ws2tcp-test" {
				t.Fatalf("home = %q, want %q", home, "/tmp/ws2tcp-test")
			}
			if console {
				t.Fatal("service run should disable console logging")
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
