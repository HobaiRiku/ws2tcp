package cmd

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestConfigShowPathSetAndClientAuth(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "config", "show")
	if err != nil {
		t.Fatalf("config show returned error: %v", err)
	}
	if !strings.Contains(out, "client_secret: s1") {
		t.Fatalf("unexpected show output: %q", out)
	}

	out, err = executeRoot(t, "--home", home, "config", "path")
	if err != nil {
		t.Fatalf("config path returned error: %v", err)
	}
	if strings.TrimSpace(out) != filepath.Join(home, "config.yaml") {
		t.Fatalf("unexpected config path: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "config", "set", "app.log_level", "debug")
	if err != nil {
		t.Fatalf("config set returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "config", "client-auth", "set",
		"--client-id", "u2",
		"--client-secret", "s2",
	)
	if err != nil {
		t.Fatalf("client-auth set returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if cfg.App.LogLevel != "debug" {
		t.Fatalf("unexpected log level: %q", cfg.App.LogLevel)
	}
	if cfg.Client.ClientID != "u2" || cfg.Client.ClientSecret != "s2" {
		t.Fatalf("unexpected client auth: %+v", cfg.Client)
	}
}
