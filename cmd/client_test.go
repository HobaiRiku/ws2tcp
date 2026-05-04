package cmd

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"websocket2Tcp/internal/config"
)

func TestClientEndpointShowAndSet(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "client", "endpoint", "show", "--client", "prod")
	if err != nil {
		t.Fatalf("endpoint show returned error: %v", err)
	}
	if !strings.Contains(out, "host: x") {
		t.Fatalf("unexpected endpoint show output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "client", "endpoint", "set",
		"--client", "prod",
		"--host", "api.example.com",
		"--ip", "198.51.100.12",
		"--port", "8443",
		"--path", "/edge",
		"--wss",
		"--aes-key", "njpjvjkgfykgpqpcksvjydvlctgznlnz",
		"--ssl-reject-unauthorized",
	)
	if err != nil {
		t.Fatalf("endpoint set returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if cfg.Client.Endpoints[0].Host != "api.example.com" || cfg.Client.Endpoints[0].Port != 8443 || !cfg.Client.Endpoints[0].WSS {
		t.Fatalf("unexpected endpoint after set: %+v", cfg.Client.Endpoints[0])
	}
}

func TestClientTunnelCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "client", "tunnels", "list", "--client", "prod")
	if err != nil {
		t.Fatalf("tunnels list returned error: %v", err)
	}
	if !strings.Contains(out, "t1") {
		t.Fatalf("unexpected list output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "client", "tunnels", "add",
		"--client", "prod",
		"--name", "db",
		"--listen", "127.0.0.1:3306",
		"--target", "10.0.0.10:3306",
	)
	if err != nil {
		t.Fatalf("tunnels add returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "client", "tunnels", "update", "db",
		"--client", "prod",
		"--listen", "127.0.0.1:13306",
		"--target", "db.internal:3307",
	)
	if err != nil {
		t.Fatalf("tunnels update returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "client", "tunnels", "rm", "t1", "--client", "prod")
	if err != nil {
		t.Fatalf("tunnels rm returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Client.Clients[0].Tunnels) != 1 {
		t.Fatalf("unexpected tunnel count: %d", len(cfg.Client.Clients[0].Tunnels))
	}
	if cfg.Client.Clients[0].Tunnels[0].Name != "db" || cfg.Client.Clients[0].Tunnels[0].Listen != "127.0.0.1:13306" || cfg.Client.Clients[0].Tunnels[0].TargetPort != 3307 {
		t.Fatalf("unexpected tunnel after mutations: %+v", cfg.Client.Clients[0].Tunnels[0])
	}
}

func writeTestConfig(t *testing.T) string {
	t.Helper()

	home := t.TempDir()
	raw := `app:
  http_listen: "127.0.0.1:7321"
  http_auth: true
  log_level: info
server:
  listen: "0.0.0.0:3005"
  ws_path: /connect
  aes_key: "njpjvjkgfykgpqpcksvjydvlctgznlnz"
  use_encryption: true
  clients:
    - id: u1
      secret: s1
client:
  endpoints:
    - name: edge
      host: x
      port: 3005
      path: /c
      aes_key: "njpjvjkgfykgpqpcksvjydvlctgznlnz"
  clients:
    - name: prod
      endpoint: edge
      client_id: u1
      client_secret: s1
      tunnels:
        - name: t1
          listen: "127.0.0.1:1"
          target_host: x
          target_port: 22
`
	if err := os.WriteFile(filepath.Join(home, "config.yaml"), []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}
	return home
}

func mustLoadConfig(t *testing.T, path string) *config.Config {
	t.Helper()
	cfg, err := config.Load(path)
	if err != nil {
		t.Fatal(err)
	}
	return cfg
}
