package client

import (
	"context"
	"log/slog"
	"reflect"
	"sync"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/config"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/services"
)

// Manager supervises N tunnels in one process. It owns one cancellable
// goroutine per tunnel and reacts to registry.Apply by diffing the
// previous and current snapshots:
//
//   - new tunnel  -> spin up
//   - removed     -> cancel + drop
//   - changed     -> cancel + restart
//   - endpoint changed -> cancel + restart every tunnel that uses it
//
// "Cancel + restart" is what gives the design its "edit a tunnel = reset
// only its own connections" property.
type Manager struct {
	registry *services.Registry
	runtime  *services.Runtime
	log      *slog.Logger

	mu      sync.Mutex
	running map[string]*runningTunnel // keyed by tunnel name
	rootCtx context.Context
}

type runningTunnel struct {
	cfg    config.Tunnel
	ep     config.Endpoint
	cancel context.CancelFunc
	done   chan struct{}
}

// NewManager constructs the manager but does not start anything; call Run.
func NewManager(reg *services.Registry, rt *services.Runtime, log *slog.Logger) *Manager {
	return &Manager{
		registry: reg,
		runtime:  rt,
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

	desired := map[string]config.Tunnel{}
	for _, t := range m.registry.Tunnels() {
		desired[t.Name] = t
	}

	// 1. cancel removals and changes
	for name, rt := range m.running {
		want, ok := desired[name]
		if !ok {
			m.stopLocked(name)
			continue
		}
		ep, err := m.registry.FindEndpoint(want.Endpoint)
		if err != nil {
			m.log.Error("missing endpoint on reconcile", "tunnel", name, "endpoint", want.Endpoint)
			m.stopLocked(name)
			continue
		}
		if !reflect.DeepEqual(rt.cfg, want) || !reflect.DeepEqual(rt.ep, ep) {
			m.stopLocked(name)
		}
	}

	// 2. start everything desired but not running
	for name, want := range desired {
		if _, ok := m.running[name]; ok {
			continue
		}
		ep, err := m.registry.FindEndpoint(want.Endpoint)
		if err != nil {
			m.log.Error("tunnel references unknown endpoint", "tunnel", name, "endpoint", want.Endpoint)
			continue
		}
		m.startLocked(want, ep)
	}
}

func (m *Manager) startLocked(t config.Tunnel, ep config.Endpoint) {
	tCtx, cancel := context.WithCancel(m.rootCtx)
	rt := &runningTunnel{cfg: t, ep: ep, cancel: cancel, done: make(chan struct{})}
	m.running[t.Name] = rt

	tunnel := NewTunnel(t, ep, m.runtime, m.log)
	go func() {
		defer close(rt.done)
		if err := tunnel.Run(tCtx); err != nil {
			m.log.Error("tunnel exited with error", "tunnel", t.Name, "err", err)
		}
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

// Running returns the names of currently-running tunnels (snapshot).
func (m *Manager) Running() []string {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := make([]string, 0, len(m.running))
	for name := range m.running {
		out = append(out, name)
	}
	return out
}
