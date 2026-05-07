//go:build e2e

// Package e2e runs end-to-end smoke tests over a live (in-process) ws2tcp
// stack: real server, real client manager, real WS handshake, real TCP
// bridge. Tests are gated by the `e2e` build tag so `go test ./...` /
// `make test` stay fast and hermetic; run with `make test-e2e`.
//
// Each harness gets its own t.TempDir() WS2TCP_HOME — Go's testing
// framework removes it on test completion, so nothing leaks into the
// developer's real ~/.ws2tcp.
package e2e

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"os"
	"sync"
	"testing"
	"time"

	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/app"
	"websocket2Tcp/internal/config"
	applog "websocket2Tcp/internal/log"
	"websocket2Tcp/internal/paths"
)

// 32 字节, 满足 server.aes_key 校验. 只在 e2e 测试里用, 不要进真实部署.
const e2eAESKey = "e2eaeskeyaaaaaaaaaaaaaaaaaaaaaaa"

// harnessOpts captures the few knobs we vary across e2e cases. Anything
// outside this struct is held constant by buildConfig so the test bodies
// stay short.
type harnessOpts struct {
	serverPort    int
	tunnelPort    int
	targetAddr    string // host:port the tunnel bridges to (the echo server)
	useEncryption bool
	clientID      string
	clientSecret  string
	// 可选: 模拟 client 用错误的 secret, 看 server 拒绝
	overrideClientSecret string
	// 可选: 给 server.clients[0] 设一条 ACL, 让目标 host:port 不在允许范围
	denyACL bool
}

type harness struct {
	t       *testing.T
	home    string
	logFile string
	opts    harnessOpts
	cancel  context.CancelFunc
	done    chan struct{}
	closer  io.Closer
}

// startHarness boots a full ws2tcp stack with the given options and waits
// until the local tunnel listener is accepting TCP. The returned harness is
// automatically stopped via t.Cleanup, but tests can still Stop it early when
// they need to observe shutdown behavior before returning.
func startHarness(t *testing.T, opts harnessOpts) *harness {
	t.Helper()

	home := t.TempDir()
	p, err := paths.Resolve(home)
	if err != nil {
		t.Fatalf("paths.Resolve: %v", err)
	}
	if err := p.EnsureTree(); err != nil {
		t.Fatalf("paths.EnsureTree: %v", err)
	}

	cfg := buildConfig(opts)
	writeConfig(t, p.Config(), cfg)

	logger, tap, closer, err := applog.Init(applog.Options{
		Level:   "info",
		File:    p.LogFile(),
		Console: false,
	})
	if err != nil {
		t.Fatalf("log.Init: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})

	h := &harness{
		t:       t,
		home:    home,
		logFile: p.LogFile(),
		opts:    opts,
		cancel:  cancel,
		done:    done,
		closer:  closer,
	}
	t.Cleanup(h.Stop)

	go func() {
		defer close(done)
		_ = app.Run(ctx, app.Options{
			Paths:  p,
			Config: cfg,
			Logger: logger,
			LogTap: tap,
		})
	}()

	if !waitForTCP(fmt.Sprintf("127.0.0.1:%d", opts.tunnelPort), 5*time.Second) {
		h.Stop()
		t.Fatalf("tunnel listener at 127.0.0.1:%d never came up", opts.tunnelPort)
	}
	return h
}

// Stop cancels the app context and waits for the run goroutine to drain.
// Safe to call multiple times — idempotent because cancel and closer are
// both no-ops the second time.
func (h *harness) Stop() {
	h.cancel()
	select {
	case <-h.done:
	case <-time.After(10 * time.Second):
		h.t.Errorf("harness.Stop: app.Run did not exit within 10s")
	}
	if h.closer != nil {
		_ = h.closer.Close()
		h.closer = nil
	}
}

func (h *harness) requireLogContainsAll(needles ...string) {
	h.t.Helper()

	deadline := time.Now().Add(3 * time.Second)
	for time.Now().Before(deadline) {
		raw, err := os.ReadFile(h.logFile)
		if err == nil {
			matched := true
			for _, needle := range needles {
				if !bytes.Contains(raw, []byte(needle)) {
					matched = false
					break
				}
			}
			if matched {
				return
			}
		}
		time.Sleep(50 * time.Millisecond)
	}

	raw, _ := os.ReadFile(h.logFile)
	h.t.Fatalf("expected log %q in %s, got:\n%s", needles, h.logFile, string(raw))
}

// buildConfig produces a self-contained config that runs both server and
// client roles in the same process and points the client tunnel at the
// caller-supplied target_addr.
func buildConfig(opts harnessOpts) *config.Config {
	if opts.clientID == "" {
		opts.clientID = "e2e-client"
	}
	if opts.clientSecret == "" {
		opts.clientSecret = "e2e-secret"
	}

	targetHost, targetPortStr, err := net.SplitHostPort(opts.targetAddr)
	if err != nil {
		panic("buildConfig: bad target_addr: " + err.Error())
	}
	var targetPort int
	if _, err := fmt.Sscanf(targetPortStr, "%d", &targetPort); err != nil {
		panic("buildConfig: bad target_port: " + err.Error())
	}

	clientHandshakeSecret := opts.clientSecret
	if opts.overrideClientSecret != "" {
		clientHandshakeSecret = opts.overrideClientSecret
	}

	serverClient := config.ClientIdentity{
		ID:     opts.clientID,
		Secret: opts.clientSecret,
	}
	if opts.denyACL {
		// 故意配一条不会命中目标的 ACL: 192.0.2.0/24 是 RFC5737 文档保留段,
		// 真实 127.0.0.1 echo target 一定不在里头.
		serverClient.ACL = []config.ACLRule{
			{CIDR: "192.0.2.0/24", Ports: []string{"1-65535"}},
		}
	}

	return &config.Config{
		App: config.AppConfig{
			HTTPListen: "127.0.0.1:0", // API 不绑端口, e2e 不测它
			HTTPAuth:   false,
			HTTPToken:  "",
			LogLevel:   "info",
		},
		Server: config.ServerConfig{
			Listen:        fmt.Sprintf("127.0.0.1:%d", opts.serverPort),
			WSPath:        "/connect",
			AESKey:        e2eAESKey,
			UseEncryption: opts.useEncryption,
			Clients:       []config.ClientIdentity{serverClient},
		},
		Client: config.ClientConfig{
			Endpoints: []config.Endpoint{
				{
					Name:                  "edge",
					Host:                  "127.0.0.1",
					Port:                  opts.serverPort,
					Path:                  "/connect",
					WSS:                   false,
					AESKey:                e2eAESKey,
					SSLRejectUnauthorized: false,
				},
			},
			Clients: []config.ClientProfile{
				{
					Name:         "p1",
					Endpoint:     "edge",
					ClientID:     opts.clientID,
					ClientSecret: clientHandshakeSecret,
					Tunnels: []config.Tunnel{
						{
							Name:       "t1",
							Listen:     fmt.Sprintf("127.0.0.1:%d", opts.tunnelPort),
							TargetHost: targetHost,
							TargetPort: targetPort,
						},
					},
				},
			},
		},
	}
}

func writeConfig(t *testing.T, path string, cfg *config.Config) {
	t.Helper()
	raw, err := yaml.Marshal(cfg)
	if err != nil {
		t.Fatalf("yaml.Marshal: %v", err)
	}
	if err := os.WriteFile(path, raw, 0o600); err != nil {
		t.Fatalf("write config: %v", err)
	}
}

// freePort grabs an ephemeral TCP port and releases it. There's an
// unavoidable TOCTOU window before the real listener binds, but on a
// quiet test runner that's sub-millisecond and rarely lost.
func freePort(t *testing.T) int {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("freePort: %v", err)
	}
	defer ln.Close()
	return ln.Addr().(*net.TCPAddr).Port
}

// startEcho launches a tiny TCP echo server on 127.0.0.1 and returns its
// address + a Close that tears it down. Used as the "real" target a
// tunnel bridges to.
func startEcho(t *testing.T) (addr string, stop func()) {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("echo listen: %v", err)
	}
	var wg sync.WaitGroup
	go func() {
		for {
			c, err := ln.Accept()
			if err != nil {
				return
			}
			wg.Add(1)
			go func(c net.Conn) {
				defer wg.Done()
				defer c.Close()
				_, _ = io.Copy(c, c)
			}(c)
		}
	}()
	return ln.Addr().String(), func() {
		_ = ln.Close()
		wg.Wait()
	}
}

// waitForTCP polls Dial until it succeeds or the timeout expires.
func waitForTCP(addr string, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		c, err := net.DialTimeout("tcp", addr, 200*time.Millisecond)
		if err == nil {
			_ = c.Close()
			return true
		}
		time.Sleep(50 * time.Millisecond)
	}
	return false
}
