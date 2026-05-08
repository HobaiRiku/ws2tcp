package cmd

import (
	"os"
	"path/filepath"
	"testing"

	"websocket2Tcp/internal/config"
)

func writeTestConfig(t *testing.T) string {
	t.Helper()

	home := t.TempDir()
	raw := `app:
  http_listen: "127.0.0.1:7321"
  http_auth: true
  log_level: info
server:
  enabled: true
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
