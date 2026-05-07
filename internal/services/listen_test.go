package services

import (
	"errors"
	"strings"
	"testing"

	"websocket2Tcp/internal/config"
)

func TestValidateListenFormat(t *testing.T) {
	cases := []struct {
		in     string
		wantOK bool
	}{
		{"0.0.0.0:5226", true},
		{"127.0.0.1:80", true},
		{"localhost:8080", true},
		{":5226", true},
		{"[::]:443", true},
		{"example.internal:7000", true},

		{"", false},
		{"   ", false},
		{"5226", false},          // missing host
		{"127.0.0.1", false},     // missing port
		{"127.0.0.1:abc", false}, // non-numeric port
		{"127.0.0.1:99999", false},
		{"127.0.0.1:-1", false},
		{"127.0.0.1:0", false}, // OS 任选, 对长期 tunnel 没意义, 拒绝
		{"-bad-:80", false},
	}
	for _, c := range cases {
		err := validateListenFormat(c.in)
		if c.wantOK && err != nil {
			t.Errorf("validateListenFormat(%q) unexpected error: %v", c.in, err)
		}
		if !c.wantOK && err == nil {
			t.Errorf("validateListenFormat(%q) expected error, got nil", c.in)
		}
	}
}

func TestCreateTunnelRejectsBadListen(t *testing.T) {
	r, _ := newStoredRegistry(t)

	err := r.CreateTunnel("prod", config.Tunnel{
		Name:       "bad",
		Listen:     "not-a-listen",
		TargetHost: "x",
		TargetPort: 22,
	})
	if err == nil {
		t.Fatal("expected error for malformed listen")
	}
	if !strings.Contains(err.Error(), "invalid listen") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCreateTunnelRejectsConflictingListen(t *testing.T) {
	r, _ := newStoredRegistry(t)

	err := r.CreateTunnel("prod", config.Tunnel{
		Name:       "dup",
		Listen:     "127.0.0.1:1", // same as fixture tunnel "t1"
		TargetHost: "x",
		TargetPort: 22,
	})
	if err == nil {
		t.Fatal("expected conflict error")
	}
	if !strings.Contains(err.Error(), "already used by tunnel prod/t1") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestCreateTunnelSurfacesProbeFailure(t *testing.T) {
	r, _ := newStoredRegistry(t)
	listenProbe = func(string) error { return errors.New("boom: address already in use") }

	err := r.CreateTunnel("prod", config.Tunnel{
		Name:       "busy",
		Listen:     "127.0.0.1:5555",
		TargetHost: "x",
		TargetPort: 22,
	})
	if err == nil {
		t.Fatal("expected probe failure to surface")
	}
	if !strings.Contains(err.Error(), "not bindable") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestUpdateTunnelSkipsProbeWhenListenUnchanged(t *testing.T) {
	r, _ := newStoredRegistry(t)
	listenProbe = func(string) error {
		t.Fatal("probe should not run when listen is unchanged")
		return nil
	}

	listen := "127.0.0.1:1" // same as fixture
	err := r.UpdateTunnel("prod", "t1", TunnelPatch{Listen: &listen})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestNormalizeListen(t *testing.T) {
	cases := map[string]string{
		"0.0.0.0:5226":  "*:5226",
		":5226":         "*:5226",
		"127.0.0.1:80":  "127.0.0.1:80",
		"[::]:443":      "*:443",
		"localhost:80":  "localhost:80",
	}
	for in, want := range cases {
		if got := normalizeListen(in); got != want {
			t.Errorf("normalizeListen(%q) = %q, want %q", in, got, want)
		}
	}
}
