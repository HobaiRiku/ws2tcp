package config

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

const validKey = "njpjvjkgfykgpqpcksvjydvlctgznlnz" // 32 bytes

func writeTemp(t *testing.T, body string) string {
	t.Helper()
	dir := t.TempDir()
	p := filepath.Join(dir, "config.yaml")
	if err := os.WriteFile(p, []byte(body), 0o600); err != nil {
		t.Fatal(err)
	}
	return p
}

func TestLoadMissingFile(t *testing.T) {
	_, err := Load(filepath.Join(t.TempDir(), "absent.yaml"))
	if _, ok := err.(*MissingFileError); !ok {
		t.Fatalf("want *MissingFileError, got %T: %v", err, err)
	}
}

func TestLoadDefaultsAndServerOnly(t *testing.T) {
	p := writeTemp(t, `
server:
  listen: "0.0.0.0:3005"
  aes_key: "`+validKey+`"
  clients:
    - id: u1
      secret: s1
`)
	cfg, err := Load(p)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Server.WSPath != "/connect" {
		t.Errorf("ws_path default missing: %q", cfg.Server.WSPath)
	}
	if !cfg.Server.UseEncryption {
		t.Error("use_encryption should default true")
	}
	if cfg.App.HTTPListen != "127.0.0.1:7321" {
		t.Errorf("http_listen default missing: %q", cfg.App.HTTPListen)
	}
	if !cfg.App.HTTPAuth {
		t.Error("http_auth should default true")
	}
	// http_token 没有兜底默认; 缺字段就保持空, AuthService 拒绝所有访问.
	if cfg.App.HTTPToken != "" {
		t.Errorf("http_token should default to empty, got %q", cfg.App.HTTPToken)
	}
	if cfg.App.LogConsole {
		t.Error("log_console should default false")
	}
}

func TestExplicitFalseOverridesDefault(t *testing.T) {
	p := writeTemp(t, `
server:
  listen: "0.0.0.0:3005"
  aes_key: "`+validKey+`"
  use_encryption: false
  clients:
    - id: u1
      secret: s1
`)
	cfg, err := Load(p)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Server.UseEncryption {
		t.Error("explicit false should win over default true")
	}
}

func TestValidationErrorsAggregated(t *testing.T) {
	p := writeTemp(t, `
server:
  listen: "0.0.0.0:3005"
  aes_key: "tooshort"
  clients:
    - id: u1
      secret: s1
    - id: u1
      secret: s2
client:
  endpoints:
    - name: edge
      host: x
      port: 80
      path: /c
      aes_key: "`+validKey+`"
    - name: edge
      host: y
      port: 81
      path: /c
      aes_key: "`+validKey+`"
  clients:
    - name: prod
      endpoint: missing
      client_id: a
      client_secret: b
      tunnels:
        - name: t1
          listen: "127.0.0.1:1"
          target_host: x
          target_port: 22
`)
	_, err := Load(p)
	if err == nil {
		t.Fatal("expected validation error")
	}
	msg := err.Error()
	for _, want := range []string{
		"server.aes_key", "duplicated", "does not match any client.endpoints",
	} {
		if !strings.Contains(msg, want) {
			t.Errorf("missing %q in:\n%s", want, msg)
		}
	}
}

func TestLoopbackHTTPAuthFalseAllowed(t *testing.T) {
	p := writeTemp(t, `
app:
  http_listen: "127.0.0.1:7321"
  http_auth: false
`)
	if _, err := Load(p); err != nil {
		t.Fatalf("loopback + http_auth=false should be ok, got: %v", err)
	}
}

func TestNonLoopbackHTTPAuthFalseRejected(t *testing.T) {
	p := writeTemp(t, `
app:
  http_listen: "0.0.0.0:7321"
  http_auth: false
`)
	_, err := Load(p)
	if err == nil || !strings.Contains(err.Error(), "loopback") {
		t.Fatalf("want loopback error, got: %v", err)
	}
}

func TestWriteExample(t *testing.T) {
	path := filepath.Join(t.TempDir(), "config.yaml")
	if err := WriteExample(path, 0o600); err != nil {
		t.Fatal(err)
	}
	cfg, err := Load(path)
	if err != nil {
		t.Fatal(err)
	}
	// init 时的 http_token 必须是随机生成的, 不能是占位字符串, 而且至少
	// 要够 32 hex 位 (== 16 字节熵).
	tok := cfg.App.HTTPToken
	if tok == "" || tok == "change-me-management-token" || strings.HasPrefix(tok, "REGENERATE-ME") {
		t.Fatalf("http_token should be random, got %q", tok)
	}
	if len(tok) < 32 {
		t.Fatalf("http_token too short: %q", tok)
	}
	// 两次 WriteExample 必须给出不同的 token.
	other := filepath.Join(t.TempDir(), "config.yaml")
	if err := WriteExample(other, 0o600); err != nil {
		t.Fatal(err)
	}
	other2, err := Load(other)
	if err != nil {
		t.Fatal(err)
	}
	if other2.App.HTTPToken == tok {
		t.Fatal("expected each WriteExample to mint a fresh http_token")
	}
}

func TestParsePortRange(t *testing.T) {
	cases := []struct {
		in     string
		ok     bool
		lo, hi uint16
	}{
		{"22", true, 22, 22},
		{" 8000-8999 ", true, 8000, 8999},
		{"-5", false, 0, 0},
		{"100-50", false, 0, 0},
		{"0", false, 0, 0},
		{"70000", false, 0, 0},
	}
	for _, c := range cases {
		r, err := ParsePortRange(c.in)
		if (err == nil) != c.ok {
			t.Errorf("ParsePortRange(%q): err=%v, want ok=%v", c.in, err, c.ok)
			continue
		}
		if c.ok && (r.Lo != c.lo || r.Hi != c.hi) {
			t.Errorf("ParsePortRange(%q) = %+v, want {%d,%d}", c.in, r, c.lo, c.hi)
		}
	}
}

func TestWriteAtomicAndLoadNodeRoundTrip(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "rt.yaml")
	body := []byte("server:\n  listen: 127.0.0.1:3005 # keep this comment\n")
	if err := WriteAtomic(path, body, 0o600); err != nil {
		t.Fatal(err)
	}
	doc, err := LoadNode(path)
	if err != nil {
		t.Fatal(err)
	}
	out := filepath.Join(dir, "rt.out.yaml")
	if err := SaveNode(out, doc, 0o600); err != nil {
		t.Fatal(err)
	}
	got, err := os.ReadFile(out)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(got), "keep this comment") {
		t.Fatalf("comment not preserved:\n%s", got)
	}
	st, err := os.Stat(out)
	if err != nil {
		t.Fatal(err)
	}
	if st.Mode().Perm() != 0o600 {
		t.Errorf("perm = %o, want 0600", st.Mode().Perm())
	}
}
