package app_test

import (
	"bytes"
	"context"
	"io"
	"log/slog"
	"net"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/core/client"
	"websocket2Tcp/internal/core/server"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
)

const k32 = "njpjvjkgfykgpqpcksvjydvlctgznlnz"

// runEchoServer accepts one TCP connection and echoes everything back.
// Returns the listen address and a stop func.
func runEchoServer(t *testing.T) (host string, port int, stop func()) {
	t.Helper()
	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	go func() {
		for {
			c, err := ln.Accept()
			if err != nil {
				return
			}
			go func(c net.Conn) {
				defer c.Close()
				_, _ = io.Copy(c, c)
			}(c)
		}
	}()
	addr := ln.Addr().(*net.TCPAddr)
	return addr.IP.String(), addr.Port, func() { _ = ln.Close() }
}

// TestRoundTripPlain spins up a real Go server + Go client tunnel and
// pushes bytes through a TCP echo target — exercises crypto, frame,
// wsproxy, server upgrade, and client tunnel lifecycle end-to-end.
func TestRoundTripPlain(t *testing.T) {
	roundTrip(t, false)
}

func TestRoundTripEncrypted(t *testing.T) {
	roundTrip(t, true)
}

func roundTrip(t *testing.T, encrypted bool) {
	t.Helper()
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))

	// 1. Echo target the server will dial into.
	echoHost, echoPort, stopEcho := runEchoServer(t)
	defer stopEcho()

	// 2. Server-side config + Registry.
	srvCfg := config.ServerConfig{
		WSPath:        "/connect",
		AESKey:        k32,
		UseEncryption: encrypted,
		Clients: []config.ClientIdentity{
			{
				ID:     "u1",
				Secret: "s1",
				ACL: []config.ACLRule{
					{CIDR: "127.0.0.0/8", Ports: []string{strconv.Itoa(echoPort)}},
				},
			},
		},
	}
	cfg := &config.Config{
		Server: srvCfg,
		Client: config.ClientConfig{},
		App:    config.AppConfig{HTTPListen: "127.0.0.1:0", HTTPAuth: true, LogLevel: "info"},
	}
	reg, err := services.New(cfg)
	if err != nil {
		t.Fatal(err)
	}
	rt := services.NewRuntime()
	bus := events.NewBus()
	eventsCtx, stopEvents := context.WithCancel(context.Background())
	defer stopEvents()
	sub := bus.Subscribe(eventsCtx)
	handler := server.NewHandler(srvCfg, reg, rt, bus, logger)
	defer handler.Close()

	// 3. HTTP test server hosting the upgrade handler.
	httpSrv := httptest.NewServer(handler)
	defer httpSrv.Close()

	srvURL := strings.TrimPrefix(httpSrv.URL, "http://")
	srvHost, srvPortStr, _ := net.SplitHostPort(srvURL)
	srvPort, _ := strconv.Atoi(srvPortStr)

	// 4. Client-side tunnel pointed at our echo target via the server.
	ep := config.Endpoint{
		Host:   srvHost,
		Port:   srvPort,
		Path:   "/connect",
		WSS:    false,
		AESKey: k32,
	}
	tn := config.Tunnel{
		Name:       "t1",
		Listen:     "127.0.0.1:0",
		TargetHost: echoHost,
		TargetPort: echoPort,
	}

	// We need a known local port — bind it ourselves and let Tunnel use it.
	localLn, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	localAddr := localLn.Addr().String()
	localLn.Close()
	tn.Listen = localAddr

	tunnel := client.NewTunnel("prod", tn, ep, services.ClientCredentials{ClientID: "u1", ClientSecret: "s1"}, rt, bus, logger)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		_ = tunnel.Run(ctx)
	}()

	// 5. Wait for tunnel listener to come up.
	if err := waitListening(localAddr, 2*time.Second); err != nil {
		t.Fatal(err)
	}

	// 6. Connect locally, write payload, verify echo.
	c, err := net.Dial("tcp", localAddr)
	if err != nil {
		t.Fatal(err)
	}
	defer c.Close()

	payload := []byte("hello over the tunnel!")
	if _, err := c.Write(payload); err != nil {
		t.Fatal(err)
	}
	got := make([]byte, len(payload))
	c.SetReadDeadline(time.Now().Add(5 * time.Second))
	if _, err := io.ReadFull(c, got); err != nil {
		t.Fatalf("read echoed bytes: %v", err)
	}
	if !bytes.Equal(got, payload) {
		t.Fatalf("got %q, want %q", got, payload)
	}

	cancel()
	c.Close()
	wg.Wait()
	stopEvents()
	var topics []string
	for {
		select {
		case msg, ok := <-sub:
			if !ok {
				sub = nil
				continue
			}
			topics = append(topics, msg.Topic)
		case <-time.After(100 * time.Millisecond):
			goto drained
		}
	}

drained:
	if !contains(topics, "tunnel.state") {
		t.Fatalf("expected tunnel.state event, got %v", topics)
	}
	if !contains(topics, "server.conn.opened") {
		t.Fatalf("expected server.conn.opened event, got %v", topics)
	}
}

func waitListening(addr string, max time.Duration) error {
	deadline := time.Now().Add(max)
	for time.Now().Before(deadline) {
		if c, err := net.DialTimeout("tcp", addr, 100*time.Millisecond); err == nil {
			c.Close()
			return nil
		}
		time.Sleep(20 * time.Millisecond)
	}
	return &net.OpError{Op: "dial", Net: "tcp", Err: net.ErrClosed}
}

// Force the http import to stay even when we use httptest only.
var _ = http.NewServeMux

func contains(items []string, want string) bool {
	for _, item := range items {
		if item == want {
			return true
		}
	}
	return false
}
