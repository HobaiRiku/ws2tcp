package cmd

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestEndpointCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "endpoint", "list")
	if err != nil {
		t.Fatalf("endpoint list returned error: %v", err)
	}
	if !strings.Contains(out, "edge") || !strings.Contains(out, " - ") {
		t.Fatalf("unexpected endpoint list output: %q", out)
	}

	out, err = executeRoot(t, "--home", home, "endpoint", "show", "edge")
	if err != nil {
		t.Fatalf("endpoint show returned error: %v", err)
	}
	if !strings.Contains(out, "host: x") {
		t.Fatalf("unexpected endpoint show output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "endpoint", "create",
		"--name", "backup",
		"--host", "backup.example.com",
		"--port", "8443",
		"--path", "/connect",
		"--wss",
		"--aes-key", "abcdefghijklmnopqrstuvwxyzABCDEF",
		"--ssl-reject-unauthorized",
	)
	if err != nil {
		t.Fatalf("endpoint create returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "endpoint", "update", "edge",
		"--host", "api.example.com",
		"--ip", "198.51.100.12",
		"--port", "9443",
		"--path", "/edge",
		"--wss",
		"--aes-key", "njpjvjkgfykgpqpcksvjydvlctgznlnz",
		"--ssl-reject-unauthorized",
	)
	if err != nil {
		t.Fatalf("endpoint update returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "endpoint", "delete", "backup")
	if err != nil {
		t.Fatalf("endpoint delete returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Client.Endpoints) != 1 {
		t.Fatalf("unexpected endpoint count: %d", len(cfg.Client.Endpoints))
	}
	if cfg.Client.Endpoints[0].Host != "api.example.com" || cfg.Client.Endpoints[0].Port != 9443 || !cfg.Client.Endpoints[0].WSS {
		t.Fatalf("unexpected endpoint after update: %+v", cfg.Client.Endpoints[0])
	}
}

func TestClientCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "client", "list")
	if err != nil {
		t.Fatalf("client list returned error: %v", err)
	}
	if !strings.Contains(out, "prod") {
		t.Fatalf("unexpected client list output: %q", out)
	}

	out, err = executeRoot(t, "--home", home, "client", "show", "prod")
	if err != nil {
		t.Fatalf("client show returned error: %v", err)
	}
	if !strings.Contains(out, "endpoint: edge") {
		t.Fatalf("unexpected client show output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "client", "create",
		"--name", "qa",
		"--endpoint", "edge",
		"--client-id", "u2",
		"--client-secret", "s2",
	)
	if err != nil {
		t.Fatalf("client create returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "client", "update", "qa",
		"--client-id", "u3",
		"--client-secret", "s3",
	)
	if err != nil {
		t.Fatalf("client update returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "client", "delete", "prod")
	if err != nil {
		t.Fatalf("client delete returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Client.Clients) != 1 {
		t.Fatalf("unexpected client count: %d", len(cfg.Client.Clients))
	}
	if cfg.Client.Clients[0].Name != "qa" || cfg.Client.Clients[0].ClientID != "u3" {
		t.Fatalf("unexpected client after update: %+v", cfg.Client.Clients[0])
	}
}

func TestTunnelCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "tunnel", "list")
	if err != nil {
		t.Fatalf("tunnel list returned error: %v", err)
	}
	if !strings.Contains(out, "prod") || !strings.Contains(out, "edge") || !strings.Contains(out, "t1") {
		t.Fatalf("unexpected tunnel list output: %q", out)
	}

	out, err = executeRoot(t, "--home", home, "tunnel", "show", "t1", "--client", "prod")
	if err != nil {
		t.Fatalf("tunnel show returned error: %v", err)
	}
	if !strings.Contains(out, "target: x:22") {
		t.Fatalf("unexpected tunnel show output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "tunnel", "create",
		"--client", "prod",
		"--name", "db",
		"--listen", "127.0.0.1:3306",
		"--target", "10.0.0.10:3306",
	)
	if err != nil {
		t.Fatalf("tunnel create returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "tunnel", "update", "db",
		"--client", "prod",
		"--listen", "127.0.0.1:13306",
		"--target", "db.internal:3307",
	)
	if err != nil {
		t.Fatalf("tunnel update returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "tunnel", "delete", "t1", "--client", "prod")
	if err != nil {
		t.Fatalf("tunnel delete returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Client.Clients[0].Tunnels) != 1 {
		t.Fatalf("unexpected tunnel count: %d", len(cfg.Client.Clients[0].Tunnels))
	}
	if cfg.Client.Clients[0].Tunnels[0].Name != "db" || cfg.Client.Clients[0].Tunnels[0].Listen != "127.0.0.1:13306" || cfg.Client.Clients[0].Tunnels[0].TargetPort != 3307 {
		t.Fatalf("unexpected tunnel after mutations: %+v", cfg.Client.Clients[0].Tunnels[0])
	}
}
