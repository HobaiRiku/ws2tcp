package services

import (
	"context"
	"net/netip"
	"testing"

	"websocket2Tcp/internal/config"
)

const k32 = "njpjvjkgfykgpqpcksvjydvlctgznlnz"

func sampleConfig() *config.Config {
	return &config.Config{
		Server: config.ServerConfig{
			Enabled:       true,
			Listen:        "0.0.0.0:3005",
			AESKey:        k32,
			UseEncryption: true,
			Clients: []config.ClientIdentity{
				{
					ID:     "u1",
					Secret: "s1",
					ACL: []config.ACLRule{
						{CIDR: "192.168.1.0/24", Ports: []string{"22", "80-90"}},
						{CIDR: "10.0.0.0/8", Ports: []string{"3306"}},
					},
				},
				{ID: "u2", Secret: "s2"},
			},
		},
		Client: config.ClientConfig{
			Enabled: true,
			Endpoints: []config.Endpoint{
				{Name: "ep1", Host: "x", Port: 3005, Path: "/c", AESKey: k32, ClientID: "u1", ClientSecret: "s1"},
			},
			Tunnels: []config.Tunnel{
				{Name: "t1", Endpoint: "ep1", Listen: "127.0.0.1:1", TargetHost: "x", TargetPort: 22},
			},
		},
		App: config.AppConfig{HTTPListen: "127.0.0.1:7321", HTTPAuth: true, LogLevel: "info"},
	}
}

func TestVerifyOK(t *testing.T) {
	r, err := New(sampleConfig())
	if err != nil {
		t.Fatal(err)
	}
	id, ok := r.Verify("u1", "s1")
	if !ok {
		t.Fatal("verify failed for known id")
	}
	if id.ID != "u1" {
		t.Fatalf("got %q", id.ID)
	}
}

func TestVerifyRejects(t *testing.T) {
	r, _ := New(sampleConfig())
	if _, ok := r.Verify("u1", "wrong"); ok {
		t.Error("wrong secret accepted")
	}
	if _, ok := r.Verify("nope", ""); ok {
		t.Error("unknown id accepted")
	}
}

type fixedResolver map[string][]netip.Addr

func (f fixedResolver) LookupNetIP(_ context.Context, _ string, host string) ([]netip.Addr, error) {
	if v, ok := f[host]; ok {
		return v, nil
	}
	return nil, nil
}

func TestAllowsLiteralIP(t *testing.T) {
	r, _ := New(sampleConfig())
	id, _ := r.Verify("u1", "s1")
	ctx := context.Background()

	cases := []struct {
		host string
		port uint16
		want bool
	}{
		{"192.168.1.5", 22, true},
		{"192.168.1.5", 85, true},
		{"192.168.1.5", 23, false},
		{"10.0.0.5", 3306, true},
		{"10.0.0.5", 22, false},
		{"172.16.0.1", 22, false},
	}
	for _, c := range cases {
		got, err := r.Allows(ctx, id, c.host, c.port, nil)
		if err != nil {
			t.Errorf("%s:%d err: %v", c.host, c.port, err)
			continue
		}
		if got != c.want {
			t.Errorf("Allows(%s,%d) = %v, want %v", c.host, c.port, got, c.want)
		}
	}
}

func TestAllowsDNSAllAddrsMustMatch(t *testing.T) {
	r, _ := New(sampleConfig())
	id, _ := r.Verify("u1", "s1")
	resolver := fixedResolver{
		"good.example": {netip.MustParseAddr("192.168.1.5"), netip.MustParseAddr("192.168.1.6")},
		"mixed.example": {netip.MustParseAddr("192.168.1.5"), netip.MustParseAddr("8.8.8.8")},
	}
	ctx := context.Background()

	if ok, err := r.Allows(ctx, id, "good.example", 22, resolver); err != nil || !ok {
		t.Fatalf("good.example should allow: ok=%v err=%v", ok, err)
	}
	if ok, _ := r.Allows(ctx, id, "mixed.example", 22, resolver); ok {
		t.Fatal("mixed.example should be denied — strict mode requires ALL addrs match")
	}
}

func TestApplySwapsSnapshot(t *testing.T) {
	r, err := New(sampleConfig())
	if err != nil {
		t.Fatal(err)
	}
	cfg2 := sampleConfig()
	cfg2.Server.Clients = append(cfg2.Server.Clients, config.ClientIdentity{ID: "u3", Secret: "s3"})
	if err := r.Apply(cfg2); err != nil {
		t.Fatal(err)
	}
	if _, ok := r.Verify("u3", "s3"); !ok {
		t.Fatal("Apply did not swap in new identity")
	}
}

func TestResolveTunnelEndpoint(t *testing.T) {
	r, _ := New(sampleConfig())
	tn, ep, err := r.ResolveTunnelEndpoint("t1")
	if err != nil {
		t.Fatal(err)
	}
	if tn.Name != "t1" || ep.Name != "ep1" {
		t.Fatalf("got tn=%q ep=%q", tn.Name, ep.Name)
	}
	if _, _, err := r.ResolveTunnelEndpoint("missing"); err == nil {
		t.Fatal("want error on missing tunnel")
	}
}
