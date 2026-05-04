package client

import (
	"context"
	"log/slog"
	"reflect"
	"sync"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
)

// Manager supervises N tunnels in one process. It owns one cancellable
// goroutine per tunnel and reacts to registry.Apply by diffing the
// previous and current snapshots:
//
//   - new tunnel  -> spin up
//   - removed     -> cancel + drop
//   - changed     -> cancel + restart
//   - client endpoint/auth changed -> cancel + restart every tunnel
//
// "Cancel + restart" is what gives the design its "edit a tunnel = reset
// only its own connections" property.
type Manager struct {
	registry *services.Registry
	runtime  *services.Runtime
	events   *events.Bus
	log      *slog.Logger

	mu      sync.Mutex
	running map[string]*runningTunnel // keyed by tunnel name
	rootCtx context.Context
}

type runningTunnel struct {
	key    string
	client string
	cfg    config.Tunnel
	ep     config.Endpoint
	auth   services.ClientCredentials
	cancel context.CancelFunc
	done   chan struct{}
}

// NewManager constructs the manager but does not start anything; call Run.
func NewManager(reg *services.Registry, rt *services.Runtime, bus *events.Bus, log *slog.Logger) *Manager {
	return &Manager{
		registry: reg,
		runtime:  rt,
		events:   bus,
		log:      log.With("component", "client.manager"),
		running:  map[string]*runningTunnel{},
	}
}

// Run starts each configured tunnel and blocks until ctx is cancelled.
// Apply-driven edits land via the registry's OnApply hook.
func (m *Manager) Run(ctx context.Context) {
	m.rootCtx = ctx
	m.reconcile()
	m.registry.OnApply(m.reconcile)

	<-ctx.Done()
	m.shutdownAll()
}

func (m *Manager) reconcile() {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.rootCtx == nil {
		return // not yet running
	}
	if err := m.rootCtx.Err(); err != nil {
		return
	}

	desired := map[string]services.ClientTunnelBinding{}
	for _, binding := range m.registry.ClientTunnelBindings() {
		desired[binding.Key] = binding
	}

	// 1. cancel removals and changes
	for key, rt := range m.running {
		want, ok := desired[key]
		if !ok {
			m.stopLocked(key)
			continue
		}
		if !reflect.DeepEqual(rt.cfg, want.Tunnel) || !reflect.DeepEqual(rt.ep, want.Endpoint) || !reflect.DeepEqual(rt.auth, want.Credentials) {
			m.stopLocked(key)
		}
	}

	// 2. start everything desired but not running
	for key, want := range desired {
		if _, ok := m.running[key]; ok {
			continue
		}
		m.startLocked(want)
	}
}

func (m *Manager) startLocked(binding services.ClientTunnelBinding) {
	tCtx, cancel := context.WithCancel(m.rootCtx)
	rt := &runningTunnel{
		key:    binding.Key,
		client: binding.ClientName,
		cfg:    binding.Tunnel,
		ep:     binding.Endpoint,
		auth:   binding.Credentials,
		cancel: cancel,
		done:   make(chan struct{}),
	}
	m.running[binding.Key] = rt

	m.runtime.SetTunnelState(
		binding.ClientName,
		binding.Tunnel.Name,
		binding.Endpoint.Name,
		binding.Tunnel.Listen,
		"starting",
		"",
	)
	m.events.Emit("tunnel.state", map[string]any{
		"client": binding.ClientName,
		"tunnel": binding.Tunnel.Name,
		"state":  "starting",
	})
	tunnel := NewTunnel(binding.ClientName, binding.Tunnel, binding.Endpoint, binding.Credentials, m.runtime, m.events, m.log.With("client", binding.ClientName))
	go func() {
		defer close(rt.done)
		if err := tunnel.Run(tCtx); err != nil {
			m.runtime.SetTunnelState(
				binding.ClientName,
				binding.Tunnel.Name,
				binding.Endpoint.Name,
				binding.Tunnel.Listen,
				"error",
				err.Error(),
			)
			m.events.Emit("tunnel.state", map[string]any{
				"client": binding.ClientName,
				"tunnel": binding.Tunnel.Name,
				"state":  "error",
				"error":  err.Error(),
			})
			m.log.Error("tunnel exited with error", "client", binding.ClientName, "tunnel", binding.Tunnel.Name, "err", err)
			return
		}
		m.runtime.SetTunnelState(
			binding.ClientName,
			binding.Tunnel.Name,
			binding.Endpoint.Name,
			binding.Tunnel.Listen,
			"stopped",
			"",
		)
		m.events.Emit("tunnel.state", map[string]any{
			"client": binding.ClientName,
			"tunnel": binding.Tunnel.Name,
			"state":  "stopped",
		})
	}()
}

func (m *Manager) stopLocked(name string) {
	rt, ok := m.running[name]
	if !ok {
		return
	}
	rt.cancel()
	<-rt.done
	delete(m.running, name)
}

func (m *Manager) shutdownAll() {
	m.mu.Lock()
	defer m.mu.Unlock()
	for name := range m.running {
		m.stopLocked(name)
	}
}

// Running returns the currently-running client+tunnel keys (snapshot).
func (m *Manager) Running() []string {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := make([]string, 0, len(m.running))
	for name := range m.running {
		out = append(out, name)
	}
	return out
}
