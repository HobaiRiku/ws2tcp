package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
)

const testAESKey = "njpjvjkgfykgpqpcksvjydvlctgznlnz"

func TestHealthVersionAndConfigEndpoints(t *testing.T) {
	router, p := newTestRouter(t)

	rr := performJSON(t, router, http.MethodGet, "/api/health", nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"ok":true`) {
		t.Fatalf("unexpected health response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/version", nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"version"`) {
		t.Fatalf("unexpected version response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/config/path", nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), p.Config()) {
		t.Fatalf("unexpected config path response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/config", nil)
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected config response: %d %s", rr.Code, rr.Body.String())
	}
	if strings.Contains(rr.Body.String(), `"client_secret":"s1"`) || strings.Contains(rr.Body.String(), `"aes_key":"`+testAESKey+`"`) {
		t.Fatalf("config secrets were not redacted: %s", rr.Body.String())
	}
}

func TestClientEndpoints(t *testing.T) {
	router, p := newTestRouter(t)

	rr := performJSON(t, router, http.MethodPut, "/api/client/prod/endpoint", config.Endpoint{
		Host:                  "api.example.com",
		IP:                    "198.51.100.20",
		Port:                  8443,
		Path:                  "/edge",
		WSS:                   true,
		AESKey:                testAESKey,
		SSLRejectUnauthorized: true,
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected endpoint put response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPost, "/api/client/prod/tunnels", config.Tunnel{
		Name:       "db",
		Listen:     "127.0.0.1:3306",
		TargetHost: "10.0.0.10",
		TargetPort: 3306,
	})
	if rr.Code != http.StatusCreated {
		t.Fatalf("unexpected tunnel post response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/client/prod/tunnels/db", tunnelPatchRequest{
		Listen:     ptr("127.0.0.1:13306"),
		TargetHost: ptr("db.internal"),
		TargetPort: intPtr(3307),
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected tunnel patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodDelete, "/api/client/prod/tunnels/t1", nil)
	if rr.Code != http.StatusNoContent {
		t.Fatalf("unexpected tunnel delete response: %d %s", rr.Code, rr.Body.String())
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Client.Endpoints[0].Host != "api.example.com" || cfg.Client.Endpoints[0].Port != 8443 {
		t.Fatalf("unexpected endpoint after api update: %+v", cfg.Client.Endpoints[0])
	}
	if len(cfg.Client.Clients[0].Tunnels) != 1 || cfg.Client.Clients[0].Tunnels[0].Name != "db" || cfg.Client.Clients[0].Tunnels[0].TargetPort != 3307 {
		t.Fatalf("unexpected tunnels after api update: %+v", cfg.Client.Clients[0].Tunnels)
	}
}

func TestServerClientEndpoints(t *testing.T) {
	router, p := newTestRouter(t)

	rr := performJSON(t, router, http.MethodPost, "/api/server/clients", config.ClientIdentity{
		ID:     "u2",
		Secret: "s2",
		ACL: []config.ACLRule{
			{CIDR: "10.0.0.0/8", Ports: []string{"3306"}},
		},
	})
	if rr.Code != http.StatusCreated {
		t.Fatalf("unexpected client post response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/server/clients/u2", clientPatchRequest{
		Secret: ptr("rotated"),
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected client patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPut, "/api/server/clients/u2/acl", []config.ACLRule{
		{CIDR: "192.168.1.0/24", Ports: []string{"22", "80"}},
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected acl put response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodDelete, "/api/server/clients/u1", nil)
	if rr.Code != http.StatusNoContent {
		t.Fatalf("unexpected client delete response: %d %s", rr.Code, rr.Body.String())
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	if len(cfg.Server.Clients) != 1 || cfg.Server.Clients[0].ID != "u2" || cfg.Server.Clients[0].Secret != "rotated" {
		t.Fatalf("unexpected clients after api update: %+v", cfg.Server.Clients)
	}
}

func newTestRouter(t *testing.T) (*gin.Engine, paths.Paths) {
	t.Helper()
	gin.SetMode(gin.TestMode)

	p, err := paths.Resolve(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := p.EnsureTree(); err != nil {
		t.Fatal(err)
	}

	raw := `app:
  http_listen: "127.0.0.1:7321"
  http_auth: true
  log_level: info
server:
  enabled: true
  listen: "0.0.0.0:3005"
  ws_path: /connect
  aes_key: "` + testAESKey + `"
  use_encryption: true
  clients:
    - id: u1
      secret: s1
client:
  enabled: true
  endpoints:
    - name: edge
      host: x
      port: 3005
      path: /c
      aes_key: "` + testAESKey + `"
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
	if err := os.WriteFile(filepath.Join(p.Home, "config.yaml"), []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	reg, err := services.NewWithPaths(cfg, p)
	if err != nil {
		t.Fatal(err)
	}

	return NewRouter(Options{
		Registry: reg,
		Runtime:  services.NewRuntime(),
	}), p
}

func performJSON(t *testing.T, handler http.Handler, method, path string, body any) *httptest.ResponseRecorder {
	t.Helper()

	var reqBody *bytes.Reader
	if body == nil {
		reqBody = bytes.NewReader(nil)
	} else {
		raw, err := json.Marshal(body)
		if err != nil {
			t.Fatal(err)
		}
		reqBody = bytes.NewReader(raw)
	}

	req := httptest.NewRequest(method, path, reqBody)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	return rr
}

func ptr(s string) *string { return &s }

func intPtr(v int) *int { return &v }
