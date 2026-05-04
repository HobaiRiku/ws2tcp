package cmd

import (
	"path/filepath"
	"strings"
	"testing"
)

func TestServerClientCommands(t *testing.T) {
	home := writeTestConfig(t)

	out, err := executeRoot(t, "--home", home, "server", "clients", "list")
	if err != nil {
		t.Fatalf("clients list returned error: %v", err)
	}
	if !strings.Contains(out, "u1") {
		t.Fatalf("unexpected list output: %q", out)
	}

	_, err = executeRoot(t, "--home", home, "server", "clients", "add",
		"--id", "u2",
		"--secret", "s2",
		"--acl", "10.0.0.0/8:3306,6379",
	)
	if err != nil {
		t.Fatalf("clients add returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "server", "clients", "update", "u2",
		"--secret", "rotated",
		"--acl", "192.168.0.0/16:22,443",
	)
	if err != nil {
		t.Fatalf("clients update returned error: %v", err)
	}

	_, err = executeRoot(t, "--home", home, "server", "clients", "rm", "u1")
	if err != nil {
		t.Fatalf("clients rm returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Server.Clients) != 1 {
		t.Fatalf("unexpected client count: %d", len(cfg.Server.Clients))
	}
	if cfg.Server.Clients[0].ID != "u2" || cfg.Server.Clients[0].Secret != "rotated" {
		t.Fatalf("unexpected client after mutations: %+v", cfg.Server.Clients[0])
	}
}

func TestServerACLSetCommand(t *testing.T) {
	home := writeTestConfig(t)

	_, err := executeRoot(t, "--home", home, "server", "acl", "set", "u1",
		"192.168.1.0/24:22,80",
		"10.0.0.0/8:3306",
	)
	if err != nil {
		t.Fatalf("acl set returned error: %v", err)
	}

	cfg := mustLoadConfig(t, filepath.Join(home, "config.yaml"))
	if len(cfg.Server.Clients[0].ACL) != 2 {
		t.Fatalf("unexpected acl rule count: %d", len(cfg.Server.Clients[0].ACL))
	}
}
