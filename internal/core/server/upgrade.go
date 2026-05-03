package server

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/coder/websocket"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/core/crypto"
	"websocket2Tcp/internal/core/frame"
	"websocket2Tcp/internal/core/wsproxy"
	"websocket2Tcp/internal/services"
)

// dialTimeout is the upper bound for the inner TCP dial; intentionally
// generous so slow intranet hosts still work, but bounded so a stuck DNS
// resolver doesn't peg an upgrade handler.
const dialTimeout = 30 * time.Second

// Handler is the http.Handler that performs the WS upgrade for the server
// role. Mount it at cfg.Server.WSPath.
type Handler struct {
	cfg      config.ServerConfig
	registry *services.Registry
	replay   *ReplayStore
	runtime  *services.Runtime
	log      *slog.Logger

	// dialer is settable so tests can inject a stub. Defaults to a real
	// net.Dialer with dialTimeout.
	dialer func(ctx context.Context, network, addr string) (net.Conn, error)
}

// NewHandler constructs the upgrade handler.
func NewHandler(cfg config.ServerConfig, reg *services.Registry, rt *services.Runtime, log *slog.Logger) *Handler {
	d := &net.Dialer{Timeout: dialTimeout}
	return &Handler{
		cfg:      cfg,
		registry: reg,
		replay:   NewReplayStore(),
		runtime:  rt,
		log:      log,
		dialer:   d.DialContext,
	}
}

// Close stops the replay janitor.
func (h *Handler) Close() { h.replay.Close() }

// ServeHTTP runs the upgrade pipeline:
//
//	path/host gate -> command parse -> Verify -> replay.Reserve ->
//	Allows -> dial target -> ws.Accept -> streamUp -> Bridge.
//
// Each step that fails returns the smallest possible HTTP status the Node
// implementation already used, so existing clients keep getting consistent
// signals.
func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if !h.gatePathAndHost(w, r) {
		return
	}

	cmdStr := r.URL.Query().Get("command")
	cmd, err := ParseCommand(cmdStr, []byte(h.cfg.AESKey))
	if err != nil {
		h.deny(w, r, http.StatusUnauthorized, "auth failed", err, nil)
		return
	}

	identity, ok := h.registry.Verify(cmd.ClientID, cmd.ClientSecret)
	if !ok {
		h.deny(w, r, http.StatusUnauthorized, "auth failed",
			fmt.Errorf("verify(%s)", cmd.ClientID), &cmd)
		return
	}

	if !h.replay.Reserve(cmd.ConnID) {
		h.deny(w, r, http.StatusUnauthorized, "replay rejected",
			errors.New("connId already live"), &cmd)
		return
	}
	released := false
	releaseOnce := func() {
		if !released {
			h.replay.Release(cmd.ConnID)
			released = true
		}
	}
	defer releaseOnce()

	allowed, err := h.registry.Allows(r.Context(), identity, cmd.TargetHost, cmd.TargetPort, nil)
	if err != nil {
		h.deny(w, r, http.StatusForbidden, "ACL resolve error", err, &cmd)
		return
	}
	if !allowed {
		h.deny(w, r, http.StatusForbidden, "ACL", nil, &cmd)
		return
	}

	target := net.JoinHostPort(cmd.TargetHost, strconv.Itoa(int(cmd.TargetPort)))
	tcp, err := h.dialer(r.Context(), "tcp", target)
	if err != nil {
		h.deny(w, r, http.StatusBadGateway, "dial target failed", err, &cmd)
		return
	}

	wsConn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		// We don't gate Origin here — the Node implementation didn't, and
		// the browser-based attack surface for an internal proxy is low.
		// Operators who need it can put it behind a checking reverse proxy.
		InsecureSkipVerify: true,
		CompressionMode:    websocket.CompressionDisabled,
	})
	if err != nil {
		_ = tcp.Close()
		h.log.Warn("ws.Accept failed", "err", err, "client_id", cmd.ClientID)
		return
	}

	// Once we've upgraded, ResponseWriter is hijacked. Past this point
	// we mustn't write to w — only the ws conn or tcp conn.
	if err := h.run(r.Context(), wsConn, tcp, cmd, identity); err != nil {
		h.log.Warn("bridge ended with error",
			"err", err,
			"client_id", cmd.ClientID,
			"target", target,
			"client_ip", ClientIP(r, h.cfg.TrustProxy),
		)
	}
	releaseOnce()
}

// run sends the streamUp frame and runs wsproxy.Bridge until either side
// closes. ws is closed on return; tcp is closed by Bridge.
func (h *Handler) run(ctx context.Context, ws *websocket.Conn, tcp net.Conn, cmd HandshakeCommand, id services.Identity) error {
	useEncryption := h.cfg.UseEncryption

	var endToEndKey []byte
	if useEncryption {
		k, err := crypto.RandomKey(frame.StreamUpKeySize)
		if err != nil {
			ws.Close(websocket.StatusInternalError, "key gen")
			_ = tcp.Close()
			return fmt.Errorf("random key: %w", err)
		}
		endToEndKey = k
	}

	frameBytes, err := frame.EncodeStreamUp(useEncryption, endToEndKey)
	if err != nil {
		ws.Close(websocket.StatusInternalError, "frame encode")
		_ = tcp.Close()
		return fmt.Errorf("encode streamUp: %w", err)
	}
	wrapped, err := crypto.AesEncrypt(frameBytes, []byte(h.cfg.AESKey))
	if err != nil {
		ws.Close(websocket.StatusInternalError, "frame wrap")
		_ = tcp.Close()
		return fmt.Errorf("wrap streamUp: %w", err)
	}

	writeCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	if err := ws.Write(writeCtx, websocket.MessageText, []byte(wrapped)); err != nil {
		cancel()
		ws.Close(websocket.StatusInternalError, "frame send")
		_ = tcp.Close()
		return fmt.Errorf("send streamUp: %w", err)
	}
	cancel()

	h.runtime.IncClient(id.ID)
	defer h.runtime.DecClient(id.ID)

	netConn := websocket.NetConn(ctx, ws, websocket.MessageBinary)
	defer ws.Close(websocket.StatusNormalClosure, "")

	return wsproxy.Bridge(ctx, netConn, tcp, useEncryption, endToEndKey)
}

func (h *Handler) gatePathAndHost(w http.ResponseWriter, r *http.Request) bool {
	if r.URL.Path != h.cfg.WSPath {
		http.NotFound(w, r)
		return false
	}
	if h.cfg.WSHost != "" && r.Host != h.cfg.WSHost {
		http.NotFound(w, r)
		return false
	}
	return true
}

func (h *Handler) deny(w http.ResponseWriter, r *http.Request, status int, reason string, err error, cmd *HandshakeCommand) {
	attrs := []any{
		"status", status,
		"reason", reason,
		"client_ip", ClientIP(r, h.cfg.TrustProxy),
	}
	if err != nil {
		attrs = append(attrs, "err", err)
	}
	if cmd != nil {
		attrs = append(attrs, "client_id", cmd.ClientID, "target_host", cmd.TargetHost, "target_port", cmd.TargetPort)
	}
	h.log.Warn("upgrade denied", attrs...)
	http.Error(w, http.StatusText(status), status)
}
