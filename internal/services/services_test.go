package services

import (
	"context"
	"net/netip"
	"os"
	"strings"
	"testing"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/paths"
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
			Enabled:      true,
			ClientID:     "u1",
			ClientSecret: "s1",
			Endpoint:     config.Endpoint{Host: "x", Port: 3005, Path: "/c", AESKey: k32},
			Tunnels: []config.Tunnel{
				{Name: "t1", Listen: "127.0.0.1:1", TargetHost: "x", TargetPort: 22},
			},
		},
		App: config.AppConfig{HTTPListen: "127.0.0.1:7321", HTTPAuth: true, LogLevel: "info"},
	}
}

func newStoredRegistry(t *testing.T) (*Registry, paths.Paths) {
	t.Helper()

	p, err := paths.Resolve(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := p.EnsureTree(); err != nil {
		t.Fatal(err)
	}

	raw := strings.TrimSpace(`
# keep me
app:
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
      acl:
        - cidr: 192.168.1.0/24
          ports: ["22", "80-90"]
client:
  enabled: true
  client_id: u1
  client_secret: s1
  endpoint:
    host: x
    port: 3005
    path: /c
    aes_key: "njpjvjkgfykgpqpcksvjydvlctgznlnz"
  tunnels:
    - name: t1
      listen: "127.0.0.1:1"
      target_host: x
      target_port: 22
`) + "\n"
	if err := os.WriteFile(p.Config(), []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	r, err := NewWithPaths(cfg, p)
	if err != nil {
		t.Fatal(err)
	}
	return r, p
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
		"good.example":  {netip.MustParseAddr("192.168.1.5"), netip.MustParseAddr("192.168.1.6")},
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

func TestClientEndpoint(t *testing.T) {
	r, _ := New(sampleConfig())
	ep := r.ClientEndpoint()
	if ep.Host != "x" || ep.Port != 3005 {
		t.Fatalf("got host=%q port=%d", ep.Host, ep.Port)
	}
}

func TestCreateClientPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	err := r.CreateClient(config.ClientIdentity{
		ID:     "u2",
		Secret: "s2",
		ACL: []config.ACLRule{
			{CIDR: "10.0.0.0/8", Ports: []string{"3306"}},
		},
	})
	if err != nil {
		t.Fatal(err)
	}

	if _, ok := r.Verify("u2", "s2"); !ok {
		t.Fatal("new client not applied to live registry")
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	text := string(raw)
	if !strings.Contains(text, "# keep me") {
		t.Fatal("config comment was not preserved")
	}
	if !strings.Contains(text, "id: u2") {
		t.Fatal("new client not written to config")
	}
}

func TestUpdateClientPersistsSecretAndACL(t *testing.T) {
	r, p := newStoredRegistry(t)

	secret := "rotated"
	rules := []config.ACLRule{{CIDR: "10.0.0.0/8", Ports: []string{"443"}}}
	if err := r.UpdateClient("u1", ClientPatch{
		Secret: &secret,
		ACL:    &rules,
	}); err != nil {
		t.Fatal(err)
	}

	if _, ok := r.Verify("u1", "rotated"); !ok {
		t.Fatal("updated secret not applied")
	}
	id, err := r.FindIdentity("u1")
	if err != nil {
		t.Fatal(err)
	}
	if len(id.ACL) != 1 || !id.ACL[0].CIDR.Contains(netip.MustParseAddr("10.1.2.3")) {
		t.Fatalf("updated ACL not applied: %+v", id.ACL)
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(raw), "secret: rotated") {
		t.Fatal("updated secret not written to config")
	}
}

func TestDeleteClientPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	if err := r.DeleteClient("u1"); err != nil {
		t.Fatal(err)
	}
	if _, ok := r.Verify("u1", "s1"); ok {
		t.Fatal("deleted client still present in live registry")
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	for _, client := range cfg.Server.Clients {
		if client.ID == "u1" {
			t.Fatal("deleted client still present in server.clients")
		}
	}
}

func TestSetClientACLRollsBackOnInvalidConfig(t *testing.T) {
	r, p := newStoredRegistry(t)
	before, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}

	err = r.SetClientACL("u1", []config.ACLRule{
		{CIDR: "not-a-cidr", Ports: []string{"22"}},
	})
	if err == nil {
		t.Fatal("expected invalid ACL error")
	}

	after, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if string(after) != string(before) {
		t.Fatal("config file was not rolled back after invalid update")
	}
	if _, ok := r.Verify("u1", "s1"); !ok {
		t.Fatal("live registry changed after failed update")
	}
}
