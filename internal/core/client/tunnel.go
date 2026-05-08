// Package client owns the ws2tcp-client role: N independent local TCP
// listeners ("tunnels"), each fronting an independent WebSocket dial to
// the configured remote ws2tcp-server endpoint.
//
// Per-connection lifecycle (port of legacy/client.mjs):
//
//  1. accept TCP
//  2. generate a random clientConnectionId (anti-replay token)
//  3. build & AES-wrap the ?command= handshake string
//  4. dial WS to endpoint (URL host = endpoint.host when set, otherwise
//     endpoint.ip; if endpoint.ip is set, the underlying TCP dial is
//     redirected there via Transport.DialContext)
//  5. read first WS message, decrypt it with endpoint.aes_key, decode the
//     streamUp frame (or accept the legacy "streamUp" plaintext fallback)
//  6. wsproxy.Bridge wraps both ends and copies until either side closes
//
// A 20s ping keeps NAT/reverse-proxy idle timeouts from killing the
// connection mid-session.
package client

import (
	"context"
	"crypto/rand"
	"crypto/tls"
	"encoding/hex"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"net/url"
	"strconv"
	"sync"
	"time"

	"github.com/coder/websocket"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/core/crypto"
	"websocket2Tcp/internal/core/frame"
	"websocket2Tcp/internal/core/wsproxy"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
)

const (
	wsDialTimeout = 30 * time.Second
	pingInterval  = 20 * time.Second
)

// Tunnel runs one (listener, endpoint) pair. Construct via NewTunnel and
// drive with Run(ctx); cancelling ctx tears the listener and all live
// connections down.
type Tunnel struct {
	clientName string
	cfg        config.Tunnel
	ep         config.Endpoint
	auth       services.ClientCredentials
	runtime    *services.Runtime
	events     *events.Bus
	log        *slog.Logger
}

// NewTunnel binds a tunnel to its resolved endpoint snapshot. The endpoint
// is captured by value so a later edit (handled at the manager level via
// Apply) won't half-update an in-flight tunnel.
func NewTunnel(clientName string, t config.Tunnel, ep config.Endpoint, auth services.ClientCredentials, rt *services.Runtime, bus *events.Bus, log *slog.Logger) *Tunnel {
	return &Tunnel{clientName: clientName, cfg: t, ep: ep, auth: auth, runtime: rt, events: bus, log: log.With("tunnel", t.Name)}
}

// Run starts the local TCP listener and serves accepts until ctx is done.
// Returns nil on graceful shutdown, or the listener error otherwise.
func (t *Tunnel) Run(ctx context.Context) error {
	lc := &net.ListenConfig{}
	ln, err := lc.Listen(ctx, "tcp", t.cfg.Listen)
	if err != nil {
		return fmt.Errorf("listen %s: %w", t.cfg.Listen, err)
	}
	t.log.Info("tunnel listening", "listen", t.cfg.Listen, "endpoint_host", t.ep.Host)
	t.runtime.SetTunnelState(t.clientName, t.cfg.Name, t.ep.Name, t.cfg.Listen, "listening", "")
	t.events.Emit("tunnel.state", map[string]any{
		"client":   t.clientName,
		"tunnel":   t.cfg.Name,
		"listen":   t.cfg.Listen,
		"endpoint": t.ep.Name,
		"state":    "listening",
	})

	go func() {
		<-ctx.Done()
		_ = ln.Close()
	}()

	var wg sync.WaitGroup
	defer wg.Wait()

	for {
		c, err := ln.Accept()
		if err != nil {
			if ctx.Err() != nil {
				return nil
			}
			return fmt.Errorf("accept: %w", err)
		}
		wg.Add(1)
		go func() {
			defer wg.Done()
			t.handleConn(ctx, c)
		}()
	}
}

func (t *Tunnel) handleConn(ctx context.Context, tcp net.Conn) {
	defer tcp.Close()

	connID, err := randomConnID()
	if err != nil {
		t.log.Error("conn id gen", "err", err)
		return
	}
	auth := fmt.Sprintf("%s:%s:%s:%d:%s",
		t.auth.ClientID, t.auth.ClientSecret, t.cfg.TargetHost, t.cfg.TargetPort, connID)
	encCmd, err := crypto.AesEncrypt([]byte(auth), []byte(t.ep.AESKey))
	if err != nil {
		t.log.Error("auth encrypt", "err", err)
		return
	}

	wsURL := buildWSURL(t.ep, encCmd)
	httpClient := buildHTTPClient(t.ep)

	dialCtx, cancel := context.WithTimeout(ctx, wsDialTimeout)
	wsConn, _, err := websocket.Dial(dialCtx, wsURL, &websocket.DialOptions{
		HTTPClient:      httpClient,
		CompressionMode: websocket.CompressionDisabled,
	})
	cancel()
	if err != nil {
		t.log.Warn("ws dial failed", "err", err, "endpoint_host", t.ep.Host)
		return
	}
	defer wsConn.Close(websocket.StatusNormalClosure, "")

	// Wait for the streamUp frame before bridging — server sends it after
	// successful target dial. Anything else is a protocol error.
	useEnc, e2eKey, err := readStreamUp(ctx, wsConn, []byte(t.ep.AESKey))
	if err != nil {
		t.log.Warn("streamUp read failed", "err", err, "endpoint_host", t.ep.Host)
		return
	}

	// Spawn the keep-alive pinger; it stops when the bridge returns.
	pingCtx, stopPing := context.WithCancel(ctx)
	defer stopPing()
	go runPinger(pingCtx, wsConn, t.log)

	t.runtime.IncTunnelConnections(t.clientName, t.cfg.Name, t.ep.Name, t.cfg.Listen)
	defer t.runtime.DecTunnelConnections(t.clientName, t.cfg.Name)

	netConn := websocket.NetConn(ctx, wsConn, websocket.MessageBinary)
	if err := wsproxy.Bridge(ctx, netConn, tcp, useEnc, e2eKey, wsproxy.Counters{
		In:  t.runtime.AddClientBytesIn,
		Out: t.runtime.AddClientBytesOut,
	}); err != nil {
		// Bridge already filters expected-close errors; what's left is rare
		// enough to log at Info — operator visibility without crying wolf
		// every time a user kills their SSH client.
		t.log.Info("bridge ended", "err", err.Error())
	}
}

// readStreamUp blocks on the first ws message and decodes it. Accepts the
// legacy plaintext "streamUp" fallback for one release.
func readStreamUp(ctx context.Context, c *websocket.Conn, sharedKey []byte) (bool, []byte, error) {
	readCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	_, raw, err := c.Read(readCtx)
	if err != nil {
		return false, nil, err
	}
	if frame.IsLegacyTextStreamUp(raw) {
		return false, nil, nil
	}
	plain, err := crypto.AesDecrypt(raw, sharedKey)
	if err != nil {
		return false, nil, fmt.Errorf("decrypt streamUp: %w", err)
	}
	su, err := frame.DecodeStreamUp(plain)
	if err != nil {
		return false, nil, err
	}
	return su.UseEncryption, su.EndToEndKey, nil
}

func runPinger(ctx context.Context, c *websocket.Conn, log *slog.Logger) {
	tk := time.NewTicker(pingInterval)
	defer tk.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-tk.C:
			pctx, cancel := context.WithTimeout(ctx, 10*time.Second)
			err := c.Ping(pctx)
			cancel()
			if err != nil && !errors.Is(err, context.Canceled) {
				log.Debug("ws ping failed", "err", err)
				return
			}
		}
	}
}

func buildWSURL(ep config.Endpoint, encCmd string) string {
	scheme := "ws"
	if ep.WSS {
		scheme = "wss"
	}
	host := ep.Host
	if host == "" {
		host = ep.IP
	}
	u := url.URL{
		Scheme:   scheme,
		Host:     net.JoinHostPort(host, strconv.Itoa(ep.Port)),
		Path:     ep.Path,
		RawQuery: "command=" + url.QueryEscape(encCmd),
	}
	return u.String()
}

// buildHTTPClient gives coder/websocket a transport that:
//   - rewrites the dial target to ep.IP when set, leaving SNI/Host = ep.Host
//   - honours ssl_reject_unauthorized (false -> InsecureSkipVerify, matching
//     Node default)
func buildHTTPClient(ep config.Endpoint) *http.Client {
	dialer := &net.Dialer{Timeout: wsDialTimeout}
	dialFn := dialer.DialContext
	if ep.IP != "" {
		target := net.JoinHostPort(ep.IP, strconv.Itoa(ep.Port))
		dialFn = func(ctx context.Context, network, _ string) (net.Conn, error) {
			return dialer.DialContext(ctx, network, target)
		}
	}
	return &http.Client{
		Transport: &http.Transport{
			DialContext:     dialFn,
			TLSClientConfig: &tls.Config{InsecureSkipVerify: !ep.SSLRejectUnauthorized},
		},
	}
}

func randomConnID() (string, error) {
	b := make([]byte, 12) // 24 hex chars; collision-resistant for in-process anti-replay
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
