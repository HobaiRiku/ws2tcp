package app_test

import (
	"context"
	"io"
	"log/slog"
	"net"
	"net/http"
	"os"
	"testing"
	"time"

	"websocket2Tcp/internal/app"
	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
)

func TestRunServesManagementAPI(t *testing.T) {
	p, cfg := writeAppConfig(t, "127.0.0.1:0", true)
	auth := services.NewAuthService(p.Tokens(), p.FileMode())
	token, _, err := auth.IssueToken("cli", []string{services.TokenScopeRead})
	if err != nil {
		t.Fatal(err)
	}

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	cfg.App.HTTPListen = ln.Addr().String()
	ln.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	done := make(chan error, 1)
	go func() {
		done <- app.Run(ctx, app.Options{
			Paths:  p,
			Config: cfg,
			Logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		})
	}()

	if err := waitHTTP("http://"+cfg.App.HTTPListen+"/api/health", 3*time.Second); err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest(http.MethodGet, "http://"+cfg.App.HTTPListen+"/api/config/path", nil)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("unexpected api status: %d", resp.StatusCode)
	}

	cancel()
	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("app.Run returned error: %v", err)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("timed out waiting for app.Run to exit")
	}
}

func TestRunAllowsLoopbackWithoutAuth(t *testing.T) {
	p, cfg := writeAppConfig(t, "127.0.0.1:0", false)

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	cfg.App.HTTPListen = ln.Addr().String()
	ln.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	done := make(chan error, 1)
	go func() {
		done <- app.Run(ctx, app.Options{
			Paths:  p,
			Config: cfg,
			Logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		})
	}()

	if err := waitHTTP("http://"+cfg.App.HTTPListen+"/api/health", 3*time.Second); err != nil {
		t.Fatal(err)
	}

	resp, err := http.Get("http://" + cfg.App.HTTPListen + "/api/config/path")
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("unexpected api status: %d", resp.StatusCode)
	}

	cancel()
	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("app.Run returned error: %v", err)
		}
	case <-time.After(5 * time.Second):
		t.Fatal("timed out waiting for app.Run to exit")
	}
}

func writeAppConfig(t *testing.T, listen string, httpAuth bool) (paths.Paths, *config.Config) {
	t.Helper()

	p, err := paths.Resolve(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := p.EnsureTree(); err != nil {
		t.Fatal(err)
	}

	raw := "app:\n  http_listen: \"" + listen + "\"\n  http_auth: " + boolYAML(httpAuth) + "\n  log_level: info\n"
	if err := os.WriteFile(p.Config(), []byte(raw), 0o600); err != nil {
		t.Fatal(err)
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		t.Fatal(err)
	}
	return p, cfg
}

func waitHTTP(url string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		resp, err := http.Get(url)
		if err == nil {
			resp.Body.Close()
			if resp.StatusCode == http.StatusOK {
				return nil
			}
		}
		time.Sleep(25 * time.Millisecond)
	}
	return context.DeadlineExceeded
}

func boolYAML(v bool) string {
	if v {
		return "true"
	}
	return "false"
}
