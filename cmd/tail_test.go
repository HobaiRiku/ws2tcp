package cmd

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	applog "websocket2Tcp/internal/log"
)

func TestTailUsesConfiguredTokenAndPrintsRecentLogs(t *testing.T) {
	var authHeader string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader = r.Header.Get("Authorization")
		if r.URL.Path != "/api/logs/recent" {
			http.NotFound(w, r)
			return
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"records": []applog.Record{
				{
					Time:    time.Date(2026, 5, 8, 9, 0, 0, 0, time.UTC),
					Level:   "INFO",
					Message: "server listening",
					Attrs: map[string]any{
						"component": "server",
						"addr":      "127.0.0.1:3005",
					},
				},
			},
		})
	}))
	defer server.Close()

	home := t.TempDir()
	raw := "app:\n" +
		"  http_listen: " + strings.TrimPrefix(server.URL, "http://") + "\n" +
		"  http_auth: true\n" +
		"  http_token: test-token\n" +
		"  log_level: info\n" +
		"  log_console: true\n" +
		"  log_max_size_mb: 20\n" +
		"  log_max_backups: 10\n" +
		"  log_max_age_days: 14\n" +
		"server:\n" +
		"  enabled: false\n" +
		"client: {}\n"
	if err := os.WriteFile(filepath.Join(home, "config.yaml"), []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}

	out, err := executeRoot(t, "--home", home, "tail", "--follow=false")
	if err != nil {
		t.Fatalf("tail returned error: %v", err)
	}
	if authHeader != "Bearer test-token" {
		t.Fatalf("tail used auth header %q", authHeader)
	}
	if !strings.Contains(out, "server listening") || !strings.Contains(out, "component=server") {
		t.Fatalf("unexpected tail output: %s", out)
	}
}
