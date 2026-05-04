package api

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/coder/websocket"
	"github.com/gin-gonic/gin"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
)

const testAESKey = "njpjvjkgfykgpqpcksvjydvlctgznlnz"
const testHTTPToken = "test-management-token"

func TestHealthVersionAndConfigEndpoints(t *testing.T) {
	router, p, token, _, _ := newTestRouter(t, true)

	rr := performJSON(t, router, http.MethodGet, "/api/health", "", nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"ok":true`) {
		t.Fatalf("unexpected health response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/version", "", nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"version"`) {
		t.Fatalf("unexpected version response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/config/path", "", nil)
	if rr.Code != http.StatusUnauthorized {
		t.Fatalf("expected unauthorized config path response, got: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/config/path", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), p.Config()) {
		t.Fatalf("unexpected config path response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/config", token, nil)
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected config response: %d %s", rr.Code, rr.Body.String())
	}
	for _, secret := range []string{`"client_secret":"s1"`, `"secret":"s1"`, `"aes_key":"` + testAESKey + `"`, `"http_token":"` + testHTTPToken + `"`} {
		if strings.Contains(rr.Body.String(), secret) {
			t.Fatalf("config secrets were not redacted: %s", rr.Body.String())
		}
	}
}

func TestAuthEndpointsUseConfiguredToken(t *testing.T) {
	router, _, token, _, _ := newTestRouter(t, true)

	rr := performJSON(t, router, http.MethodGet, "/api/auth/me", "", nil)
	if rr.Code != http.StatusUnauthorized {
		t.Fatalf("expected unauthorized, got: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/auth/me", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"auth_required":true`) {
		t.Fatalf("unexpected auth/me response: %d %s", rr.Code, rr.Body.String())
	}
}

func TestClientEndpoints(t *testing.T) {
	router, p, token, _, runtime := newTestRouter(t, true)

	rr := performJSON(t, router, http.MethodGet, "/api/client/endpoints", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"name":"edge"`) {
		t.Fatalf("unexpected endpoint inventory response: %d %s", rr.Code, rr.Body.String())
	}
	if strings.Contains(rr.Body.String(), `"aes_key":"`+testAESKey+`"`) {
		t.Fatalf("endpoint aes key leaked: %s", rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPost, "/api/client/endpoints", token, config.Endpoint{
		Name:   "backup",
		Host:   "backup.example.com",
		Port:   9443,
		Path:   "/backup",
		WSS:    true,
		AESKey: testAESKey,
	})
	if rr.Code != http.StatusCreated {
		t.Fatalf("unexpected endpoint post response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/client/endpoints/edge", token, endpointPatchRequest{
		Host:                  ptr("api.example.com"),
		IP:                    ptr("198.51.100.20"),
		Port:                  intPtr(8443),
		Path:                  ptr("/edge"),
		WSS:                   boolPtr(true),
		SSLRejectUnauthorized: boolPtr(true),
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected endpoint patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPost, "/api/client/profiles", token, config.ClientProfile{
		Name:         "stage",
		Endpoint:     "backup",
		ClientID:     "u2",
		ClientSecret: "s2",
	})
	if rr.Code != http.StatusCreated {
		t.Fatalf("unexpected profile post response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/client/profiles/prod", token, clientProfilePatchRequest{
		ClientID: ptr("rotated-id"),
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected profile patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPost, "/api/client/prod/tunnels", token, config.Tunnel{
		Name:       "db",
		Listen:     "127.0.0.1:3306",
		TargetHost: "10.0.0.10",
		TargetPort: 3306,
	})
	if rr.Code != http.StatusCreated {
		t.Fatalf("unexpected tunnel post response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/client/prod/tunnels/db", token, tunnelPatchRequest{
		Listen:     ptr("127.0.0.1:13306"),
		TargetHost: ptr("db.internal"),
		TargetPort: intPtr(3307),
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected tunnel patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodDelete, "/api/client/prod/tunnels/t1", token, nil)
	if rr.Code != http.StatusNoContent {
		t.Fatalf("unexpected tunnel delete response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/client/profiles/prod", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"name":"prod"`) {
		t.Fatalf("unexpected profile response: %d %s", rr.Code, rr.Body.String())
	}
	if strings.Contains(rr.Body.String(), `"client_secret":"s1"`) {
		t.Fatalf("client secret leaked: %s", rr.Body.String())
	}

	runtime.SetTunnelState("prod", "db", "edge", "127.0.0.1:3306", "listening", "")
	runtime.IncTunnelConnections("prod", "db", "edge", "127.0.0.1:3306")
	rr = performJSON(t, router, http.MethodGet, "/api/client/runtime", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"state":"listening"`) || !strings.Contains(rr.Body.String(), `"active_connections":1`) {
		t.Fatalf("unexpected client runtime response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodDelete, "/api/client/profiles/stage", token, nil)
	if rr.Code != http.StatusNoContent {
		t.Fatalf("unexpected profile delete response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodDelete, "/api/client/endpoints/backup", token, nil)
	if rr.Code != http.StatusNoContent {
		t.Fatalf("unexpected endpoint delete response: %d %s", rr.Code, rr.Body.String())
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
	if cfg.Client.Clients[0].ClientID != "rotated-id" {
		t.Fatalf("unexpected client profile after api update: %+v", cfg.Client.Clients[0])
	}
}

func TestServerClientEndpointsAndStats(t *testing.T) {
	router, p, token, _, _ := newTestRouter(t, true)

	rr := performJSON(t, router, http.MethodPost, "/api/server/clients", token, config.ClientIdentity{
		ID:     "u2",
		Secret: "s2",
		ACL: []config.ACLRule{
			{CIDR: "10.0.0.0/8", Ports: []string{"3306"}},
		},
	})
	if rr.Code != http.StatusCreated {
		t.Fatalf("unexpected client post response: %d %s", rr.Code, rr.Body.String())
	}
	if strings.Contains(rr.Body.String(), `"secret":"`) {
		t.Fatalf("server secret leaked: %s", rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/server/clients/u2", token, clientPatchRequest{
		Secret: ptr("rotated"),
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected client patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPut, "/api/server/clients/u2/acl", token, []config.ACLRule{
		{CIDR: "192.168.1.0/24", Ports: []string{"22", "80"}},
	})
	if rr.Code != http.StatusOK {
		t.Fatalf("unexpected acl put response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/server/settings", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"use_encryption":true`) {
		t.Fatalf("unexpected server settings response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodPatch, "/api/server/settings", token, serverSettingsPatchRequest{
		UseEncryption: boolPtr(false),
	})
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"use_encryption":false`) {
		t.Fatalf("unexpected server settings patch response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodGet, "/api/server/stats", token, nil)
	if rr.Code != http.StatusOK || !strings.Contains(rr.Body.String(), `"uptime_seconds":`) {
		t.Fatalf("unexpected stats response: %d %s", rr.Code, rr.Body.String())
	}

	rr = performJSON(t, router, http.MethodDelete, "/api/server/clients/u1", token, nil)
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
	if cfg.Server.UseEncryption {
		t.Fatalf("expected patched server.use_encryption=false, got: %+v", cfg.Server)
	}
}

func TestLoopbackCanSkipAuth(t *testing.T) {
	router, _, _, _, _ := newTestRouter(t, false)

	rr := performJSON(t, router, http.MethodGet, "/api/config/path", "", nil)
	if rr.Code != http.StatusOK {
		t.Fatalf("expected open loopback route, got: %d %s", rr.Code, rr.Body.String())
	}
}

func TestEventStreamAndWebSocketEndpoints(t *testing.T) {
	router, _, token, bus, _ := newTestRouter(t, true)
	server := httptest.NewServer(router)
	defer server.Close()

	req, err := http.NewRequest(http.MethodGet, server.URL+"/api/events/stream?topic=tunnel.state", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	done := make(chan string, 1)
	go func() {
		reader := bufio.NewReader(resp.Body)
		var body strings.Builder
		for i := 0; i < 8; i++ {
			line, _ := reader.ReadString('\n')
			body.WriteString(line)
			text := body.String()
			if strings.Contains(text, "event: tunnel.state") && strings.Contains(text, `"state":"listening"`) {
				break
			}
		}
		done <- body.String()
	}()

	time.Sleep(50 * time.Millisecond)
	bus.Emit("tunnel.state", map[string]any{"state": "listening"})

	select {
	case body := <-done:
		if !strings.Contains(body, "event: tunnel.state") || !strings.Contains(body, `"state":"listening"`) {
			t.Fatalf("unexpected sse body: %s", body)
		}
	case <-time.After(3 * time.Second):
		t.Fatal("timed out waiting for sse event")
	}

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/api/events/ws?token=" + token + "&topic=server.conn.opened"
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	conn, _, err := websocket.Dial(ctx, wsURL, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(websocket.StatusNormalClosure, "")

	bus.Emit("server.conn.opened", map[string]any{"client_id": "u1"})
	_, raw, err := conn.Read(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(raw), `"topic":"server.conn.opened"`) || !strings.Contains(string(raw), `"client_id":"u1"`) {
		t.Fatalf("unexpected ws payload: %s", string(raw))
	}
}

func TestEventWebSocketAllowsLoopbackDevOrigin(t *testing.T) {
	router, _, token, bus, _ := newTestRouter(t, true)
	server := httptest.NewServer(router)
	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http") + "/api/events/ws?token=" + token + "&topic=tunnel.state"
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	conn, _, err := websocket.Dial(ctx, wsURL, &websocket.DialOptions{
		HTTPHeader: http.Header{
			"Origin": []string{"http://127.0.0.1:5266"},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	defer conn.Close(websocket.StatusNormalClosure, "")

	bus.Emit("tunnel.state", map[string]any{"client": "prod", "tunnel": "ssh", "state": "listening"})
	_, raw, err := conn.Read(ctx)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(raw), `"topic":"tunnel.state"`) {
		t.Fatalf("unexpected ws payload: %s", string(raw))
	}
}

func newTestRouter(t *testing.T, requireAuth bool) (*gin.Engine, paths.Paths, string, *events.Bus, *services.Runtime) {
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
  http_token: ` + testHTTPToken + `
  log_level: info
server:
  listen: "0.0.0.0:3005"
  ws_path: /connect
  aes_key: "` + testAESKey + `"
  use_encryption: true
  clients:
    - id: u1
      secret: s1
client:
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
	bus := events.NewBus()
	runtime := services.NewRuntime()

	return NewRouter(Options{
		Registry:    reg,
		Runtime:     runtime,
		Auth:        services.NewAuthService(reg.HTTPToken),
		Events:      bus,
		RequireAuth: requireAuth,
	}), p, testHTTPToken, bus, runtime
}

func performJSON(t *testing.T, handler http.Handler, method, path, token string, body any) *httptest.ResponseRecorder {
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
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	return rr
}

func ptr(s string) *string { return &s }

func intPtr(v int) *int { return &v }

func boolPtr(v bool) *bool { return &v }
