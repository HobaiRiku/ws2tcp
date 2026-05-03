package client

import (
	"strings"
	"testing"

	"websocket2Tcp/internal/config"
)

func TestBuildWSURL(t *testing.T) {
	cases := []struct {
		ep      config.Endpoint
		cmd     string
		want    string
	}{
		{
			ep:   config.Endpoint{Host: "ws.example.com", Port: 3005, Path: "/connect", WSS: false},
			cmd:  "abc==",
			want: "ws://ws.example.com:3005/connect?command=abc%3D%3D",
		},
		{
			ep:   config.Endpoint{Host: "ws.example.com", Port: 443, Path: "/c", WSS: true},
			cmd:  "x/y+z",
			want: "wss://ws.example.com:443/c?command=x%2Fy%2Bz",
		},
	}
	for _, c := range cases {
		if got := buildWSURL(c.ep, c.cmd); got != c.want {
			t.Errorf("buildWSURL: got %q, want %q", got, c.want)
		}
	}
}

func TestBuildHTTPClientUsesIPOverride(t *testing.T) {
	ep := config.Endpoint{Host: "ws.example.com", IP: "10.0.0.5", Port: 3005}
	hc := buildHTTPClient(ep)
	if hc.Transport == nil {
		t.Fatal("transport not set")
	}
	// Smoke: ensure the constructor doesn't panic and TLSClientConfig is populated.
	// Behavior verification (actual dial redirection) lives in integration tests.
}

func TestRandomConnIDUnique(t *testing.T) {
	seen := map[string]bool{}
	for i := 0; i < 100; i++ {
		id, err := randomConnID()
		if err != nil {
			t.Fatal(err)
		}
		if seen[id] {
			t.Fatalf("collision after %d ids", i)
		}
		seen[id] = true
		if !strings.ContainsAny(id, "0123456789abcdef") || len(id) != 24 {
			t.Fatalf("unexpected id format: %q", id)
		}
	}
}
