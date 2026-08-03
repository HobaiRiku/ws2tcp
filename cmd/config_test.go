package cmd

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"websocket2Tcp/internal/paths"
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
		"--client", "prod",
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
	if cfg.Client.Clients[0].ClientID != "u2" || cfg.Client.Clients[0].ClientSecret != "s2" {
		t.Fatalf("unexpected client auth: %+v", cfg.Client.Clients[0])
	}
}

func TestConfigPathDefaultsToSystemScope(t *testing.T) {
	// 不传 --home / --user / WS2TCP_HOME 时, inspect 命令必须与 install/start/stop
	// 一致地落到 system home, 而不是 user home. 否则会读到与运行中服务不同的 config.
	t.Setenv("WS2TCP_HOME", "")

	out, err := executeRoot(t, "config", "path")
	if err != nil {
		t.Fatalf("config path returned error: %v", err)
	}
	want := filepath.Join(paths.SystemHome(), "config.yaml")
	if strings.TrimSpace(out) != want {
		t.Fatalf("expected system-home config path %q, got %q", want, out)
	}
}

func TestConfigToken(t *testing.T) {
	home := t.TempDir()
	raw := `app:
  http_listen: "127.0.0.1:7321"
  http_auth: true
  http_token: "mysecrettoken"
  log_level: info
server:
  enabled: false
`
	if err := os.WriteFile(filepath.Join(home, "config.yaml"), []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}

	out, err := executeRoot(t, "--home", home, "config", "token")
	if err != nil {
		t.Fatalf("config token returned error: %v", err)
	}
	if strings.TrimSpace(out) != "mysecrettoken" {
		t.Fatalf("unexpected token output: %q", out)
	}
}
