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
			Endpoints: []config.Endpoint{
				{Name: "edge", Host: "x", Port: 3005, Path: "/c", AESKey: k32},
			},
			Clients: []config.ClientProfile{
				{
					Name:         "prod",
					Endpoint:     "edge",
					ClientID:     "u1",
					ClientSecret: "s1",
					Tunnels: []config.Tunnel{
						{Name: "t1", Listen: "127.0.0.1:1", TargetHost: "x", TargetPort: 22},
					},
				},
			},
		},
		App: config.AppConfig{HTTPListen: "127.0.0.1:7321", HTTPAuth: true, LogLevel: "info"},
	}
}

func newStoredRegistry(t *testing.T) (*Registry, paths.Paths) {
	t.Helper()

	// Stub the listen probe so the existing fixed-port tests (3306, 2222,
	// ...) don't depend on the host having those ports free.
	previous := listenProbe
	listenProbe = func(string) error { return nil }
	t.Cleanup(func() { listenProbe = previous })

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

func TestAllowsEmptyACLBypassesGate(t *testing.T) {
	cfg := sampleConfig()
	// 把 u1 的 ACL 清空, 模拟"未配置 ACL"的 client.
	cfg.Server.Clients[0].ACL = nil
	r, err := New(cfg)
	if err != nil {
		t.Fatal(err)
	}
	id, _ := r.Verify("u1", "s1")
	if len(id.ACL) != 0 {
		t.Fatalf("expected empty ACL, got: %+v", id.ACL)
	}
	// dual-stack: 应该都放行, 不解析也不调用 resolver.
	for _, host := range []string{"127.0.0.1", "::1", "8.8.8.8", "anything.example"} {
		ok, err := r.Allows(context.Background(), id, host, 9999, fixedResolver{})
		if err != nil || !ok {
			t.Errorf("empty ACL should allow %s: ok=%v err=%v", host, ok, err)
		}
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
	ep, err := r.ClientEndpoint("prod")
	if err != nil {
		t.Fatal(err)
	}
	if ep.Host != "x" || ep.Port != 3005 {
		t.Fatalf("got host=%q port=%d", ep.Host, ep.Port)
	}
}

func TestSetClientEndpointPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	err := r.SetClientEndpoint("prod", config.Endpoint{
		Host:                  "next.example.com",
		IP:                    "203.0.113.20",
		Port:                  8443,
		Path:                  "/connect-v2",
		WSS:                   true,
		AESKey:                k32,
		SSLRejectUnauthorized: true,
	})
	if err != nil {
		t.Fatal(err)
	}

	ep, err := r.ClientEndpoint("prod")
	if err != nil {
		t.Fatal(err)
	}
	if ep.Host != "next.example.com" || ep.Port != 8443 || !ep.WSS {
		t.Fatalf("updated endpoint not applied: %+v", ep)
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	text := string(raw)
	if !strings.Contains(text, "host: next.example.com") {
		t.Fatal("endpoint host not written to config")
	}
	if !strings.Contains(text, "ssl_reject_unauthorized: true") {
		t.Fatal("endpoint tls flag not written to config")
	}
}

func TestSetClientEndpointRollsBackOnInvalidConfig(t *testing.T) {
	r, p := newStoredRegistry(t)
	before, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}

	err = r.SetClientEndpoint("prod", config.Endpoint{
		Host:   "",
		Port:   3005,
		Path:   "/connect",
		AESKey: k32,
	})
	if err == nil {
		t.Fatal("expected invalid endpoint error")
	}

	after, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if string(after) != string(before) {
		t.Fatal("config file was not rolled back after invalid endpoint update")
	}
	ep, err := r.ClientEndpoint("prod")
	if err != nil {
		t.Fatal(err)
	}
	if ep.Host != "x" {
		t.Fatal("live registry changed after failed endpoint update")
	}
}

func TestEndpointCRUDPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	if err := r.CreateEndpoint(config.Endpoint{
		Name:   "backup",
		Host:   "backup.example.com",
		Port:   9443,
		Path:   "/connect",
		WSS:    true,
		AESKey: k32,
	}); err != nil {
		t.Fatal(err)
	}
	if _, err := r.FindEndpoint("backup"); err != nil {
		t.Fatalf("created endpoint missing from live registry: %v", err)
	}

	host := "backup-v2.example.com"
	port := 9555
	if err := r.UpdateEndpoint("backup", EndpointPatch{Host: &host, Port: &port}); err != nil {
		t.Fatal(err)
	}

	endpoint, err := r.FindEndpoint("backup")
	if err != nil {
		t.Fatal(err)
	}
	if endpoint.Host != host || endpoint.Port != port {
		t.Fatalf("updated endpoint not applied: %+v", endpoint)
	}

	if err := r.DeleteEndpoint("backup"); err != nil {
		t.Fatal(err)
	}
	if _, err := r.FindEndpoint("backup"); err == nil {
		t.Fatal("deleted endpoint still present in live registry")
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if strings.Contains(string(raw), "name: backup") {
		t.Fatal("deleted endpoint still present in config")
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

func TestCreateTunnelPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	err := r.CreateTunnel("prod", config.Tunnel{
		Name:       "db",
		Listen:     "127.0.0.1:3306",
		TargetHost: "10.0.0.10",
		TargetPort: 3306,
	})
	if err != nil {
		t.Fatal(err)
	}

	if _, err := r.FindTunnel("prod", "db"); err != nil {
		t.Fatalf("new tunnel not applied to live registry: %v", err)
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(raw), "name: db") {
		t.Fatal("new tunnel not written to config")
	}
}

func TestUpdateTunnelPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	listen := "127.0.0.1:2222"
	targetHost := "ssh.internal"
	targetPort := 2222
	err := r.UpdateTunnel("prod", "t1", TunnelPatch{
		Listen:     &listen,
		TargetHost: &targetHost,
		TargetPort: &targetPort,
	})
	if err != nil {
		t.Fatal(err)
	}

	tunnel, err := r.FindTunnel("prod", "t1")
	if err != nil {
		t.Fatal(err)
	}
	if tunnel.Listen != listen || tunnel.TargetHost != targetHost || tunnel.TargetPort != targetPort {
		t.Fatalf("updated tunnel not applied: %+v", tunnel)
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	text := string(raw)
	if !strings.Contains(text, "listen: 127.0.0.1:2222") {
		t.Fatal("updated tunnel listen not written to config")
	}
	if !strings.Contains(text, "target_host: ssh.internal") {
		t.Fatal("updated tunnel target host not written to config")
	}
}

func TestDeleteTunnelPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	if err := r.DeleteTunnel("prod", "t1"); err != nil {
		t.Fatal(err)
	}
	if _, err := r.FindTunnel("prod", "t1"); err == nil {
		t.Fatal("deleted tunnel still present in live registry")
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	for _, client := range cfg.Client.Clients {
		if client.Name != "prod" {
			continue
		}
		for _, tunnel := range client.Tunnels {
			if tunnel.Name == "t1" {
				t.Fatal("deleted tunnel still present in client.clients[*].tunnels")
			}
		}
	}
}

func TestSetClientCredentialsPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	if err := r.SetClientCredentials("prod", "rotated-id", "rotated-secret"); err != nil {
		t.Fatal(err)
	}

	creds, err := r.ClientCredentials("prod")
	if err != nil {
		t.Fatal(err)
	}
	if creds.ClientID != "rotated-id" || creds.ClientSecret != "rotated-secret" {
		t.Fatalf("unexpected credentials after update: %+v", creds)
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	text := string(raw)
	if !strings.Contains(text, "client_id: rotated-id") || !strings.Contains(text, "client_secret: rotated-secret") {
		t.Fatal("updated client auth not written to config")
	}
}

func TestClientProfileCRUDPersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	if err := r.CreateEndpoint(config.Endpoint{
		Name:   "backup",
		Host:   "backup.example.com",
		Port:   9443,
		Path:   "/connect",
		WSS:    true,
		AESKey: k32,
	}); err != nil {
		t.Fatal(err)
	}
	if err := r.CreateClientProfile(config.ClientProfile{
		Name:         "edge",
		Endpoint:     "backup",
		ClientID:     "edge-id",
		ClientSecret: "edge-secret",
		Tunnels: []config.Tunnel{
			{Name: "ssh", Listen: "127.0.0.1:2222", TargetHost: "10.0.0.10", TargetPort: 22},
		},
	}); err != nil {
		t.Fatal(err)
	}

	profile, err := r.FindClientProfile("edge")
	if err != nil {
		t.Fatal(err)
	}
	if profile.Endpoint != "backup" || len(profile.Tunnels) != 1 {
		t.Fatalf("created profile not applied: %+v", profile)
	}

	clientID := "edge-rotated"
	if err := r.UpdateClientProfile("edge", ClientProfilePatch{ClientID: &clientID}); err != nil {
		t.Fatal(err)
	}
	profile, err = r.FindClientProfile("edge")
	if err != nil {
		t.Fatal(err)
	}
	if profile.ClientID != clientID {
		t.Fatalf("updated client profile not applied: %+v", profile)
	}

	if err := r.DeleteClientProfile("edge"); err != nil {
		t.Fatal(err)
	}
	if _, err := r.FindClientProfile("edge"); err == nil {
		t.Fatal("deleted client profile still present in live registry")
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	for _, client := range cfg.Client.Clients {
		if client.Name == "edge" {
			t.Fatal("deleted client profile still present in config")
		}
	}
}

func TestSetConfigValuePersistsAndApplies(t *testing.T) {
	r, p := newStoredRegistry(t)

	if err := r.SetConfigValue("app.log_level", "debug"); err != nil {
		t.Fatal(err)
	}
	if err := r.SetConfigValue("client.endpoints.0.port", "8443"); err != nil {
		t.Fatal(err)
	}

	raw, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	text := string(raw)
	if !strings.Contains(text, "log_level: debug") || !strings.Contains(text, "port: 8443") {
		t.Fatal("updated config values not written to config")
	}
}

func TestSetConfigValueRollsBackOnInvalidConfig(t *testing.T) {
	r, p := newStoredRegistry(t)
	before, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}

	err = r.SetConfigValue("client.endpoints.0.port", "70000")
	if err == nil {
		t.Fatal("expected invalid config set error")
	}

	after, err := os.ReadFile(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if string(after) != string(before) {
		t.Fatal("config file was not rolled back after invalid scalar update")
	}
	ep, err := r.ClientEndpoint("prod")
	if err != nil {
		t.Fatal(err)
	}
	if ep.Port != 3005 {
		t.Fatal("live registry changed after failed config update")
	}
}
