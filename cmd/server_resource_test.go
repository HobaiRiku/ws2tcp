package cmd

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestServerCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "server", "show")
	if err != nil {
		t.Fatalf("server show returned error: %v", err)
	}
	if !strings.Contains(out, "listen: 0.0.0.0:3005") {
		t.Fatalf("unexpected server show output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "server", "disable")
	if err != nil {
		t.Fatalf("server disable returned error: %v", err)
	}
	_, err = executeRoot(t, "--home", home, "server", "enable")
	if err != nil {
		t.Fatalf("server enable returned error: %v", err)
	}
	_, err = executeRoot(t, "--home", home, "server", "update",
		"--listen", "127.0.0.1:4001",
		"--ws-path", "/new",
		"--ws-host", "ws.example.com",
		"--trust-proxy",
		"--tls-enabled",
		"--tls-cert", "certs/server.pem",
		"--tls-key", "certs/server.key",
	)
	if err != nil {
		t.Fatalf("server update returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if !cfg.Server.Enabled || cfg.Server.Listen != "127.0.0.1:4001" || cfg.Server.WSPath != "/new" {
		t.Fatalf("unexpected server config after update: %+v", cfg.Server)
	}
	if !cfg.Server.TrustProxy || !cfg.Server.TLS.Enabled || cfg.Server.TLS.Cert != "certs/server.pem" {
		t.Fatalf("unexpected server TLS/trust settings: %+v", cfg.Server)
	}
}

func TestServerClientCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "server-client", "list")
	if err != nil {
		t.Fatalf("server-client list returned error: %v", err)
	}
	if !strings.Contains(out, "u1") {
		t.Fatalf("unexpected list output: %q", out)
	}

	out, err = executeRoot(t, "--home", home, "server-client", "show", "u1")
	if err != nil {
		t.Fatalf("server-client show returned error: %v", err)
	}
	if !strings.Contains(out, "secret: s1") {
		t.Fatalf("unexpected show output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "server-client", "create",
		"--id", "u2",
		"--secret", "s2",
		"--acl", "10.0.0.0/8:3306,6379",
	)
	if err != nil {
		t.Fatalf("server-client create returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "server-client", "update", "u2",
		"--secret", "rotated",
		"--acl", "192.168.0.0/16:22,443",
	)
	if err != nil {
		t.Fatalf("server-client update returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "server-client", "delete", "u1")
	if err != nil {
		t.Fatalf("server-client delete returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Server.Clients) != 1 {
		t.Fatalf("unexpected client count: %d", len(cfg.Server.Clients))
	}
	if cfg.Server.Clients[0].ID != "u2" || cfg.Server.Clients[0].Secret != "rotated" {
		t.Fatalf("unexpected client after mutations: %+v", cfg.Server.Clients[0])
	}
	if len(cfg.Server.Clients[0].ACL) != 1 || cfg.Server.Clients[0].ACL[0].CIDR != "192.168.0.0/16" {
		t.Fatalf("unexpected acl after update: %+v", cfg.Server.Clients[0].ACL)
	}
}
