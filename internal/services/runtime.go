package services

import (
	"sort"
	"sync"
	"sync/atomic"
	"time"
)

// Runtime tracks live counters: active connection count per identity /
// tunnel, total bytes in/out. Exposed via /api/runtime and the CLI status.
//
// v1 keeps it simple — a global atomic counter pair plus per-identity
// connection gauges. Per-tunnel telemetry lands when core/client wires up.
type Runtime struct {
	// Counters are kept per-role: a single ws2tcp process can run both the
	// server subsystem and the client manager, and the same byte would be
	// counted twice (once on each side of the bridge) if there were only one
	// pair. Server counters reflect traffic seen by the WS upgrade handler;
	// client counters reflect traffic seen by tunnels.
	serverBytesIn  atomic.Uint64
	serverBytesOut atomic.Uint64
	clientBytesIn  atomic.Uint64
	clientBytesOut atomic.Uint64

	mu        sync.RWMutex
	perClient map[string]int32 // identity ID -> live connections
	perTunnel map[string]TunnelStatus
}

type TunnelStatus struct {
	Key               string    `json:"key"`
	Client            string    `json:"client"`
	Tunnel            string    `json:"tunnel"`
	Endpoint          string    `json:"endpoint"`
	Listen            string    `json:"listen"`
	State             string    `json:"state"`
	Error             string    `json:"error,omitempty"`
	ActiveConnections int32     `json:"active_connections"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// NewRuntime constructs an empty Runtime.
func NewRuntime() *Runtime {
	return &Runtime{
		perClient: map[string]int32{},
		perTunnel: map[string]TunnelStatus{},
	}
}

// Per-role byte accumulators. Server upgrade and client tunnel each call
// their own pair so the dashboard can distinguish "served traffic" from
// "tunneled traffic" without double-counting the same packet.
func (rt *Runtime) AddServerBytesIn(n uint64)  { rt.serverBytesIn.Add(n) }
func (rt *Runtime) AddServerBytesOut(n uint64) { rt.serverBytesOut.Add(n) }
func (rt *Runtime) AddClientBytesIn(n uint64)  { rt.clientBytesIn.Add(n) }
func (rt *Runtime) AddClientBytesOut(n uint64) { rt.clientBytesOut.Add(n) }

// Totals returns the four counters: (serverIn, serverOut, clientIn, clientOut).
func (rt *Runtime) Totals() (uint64, uint64, uint64, uint64) {
	return rt.serverBytesIn.Load(), rt.serverBytesOut.Load(),
		rt.clientBytesIn.Load(), rt.clientBytesOut.Load()
}

// IncClient / DecClient adjust the per-identity live connection gauge.
func (rt *Runtime) IncClient(id string) {
	rt.mu.Lock()
	rt.perClient[id]++
	rt.mu.Unlock()
}

func (rt *Runtime) DecClient(id string) {
	rt.mu.Lock()
	if v, ok := rt.perClient[id]; ok && v > 0 {
		rt.perClient[id] = v - 1
	}
	rt.mu.Unlock()
}

// ClientConnections snapshots the per-identity gauge map.
func (rt *Runtime) ClientConnections() map[string]int32 {
	rt.mu.RLock()
	defer rt.mu.RUnlock()
	out := make(map[string]int32, len(rt.perClient))
	for k, v := range rt.perClient {
		out[k] = v
	}
	return out
}

func (rt *Runtime) SetTunnelState(client, tunnel, endpoint, listen, state, errText string) {
	key := clientTunnelKey(client, tunnel)
	rt.mu.Lock()
	defer rt.mu.Unlock()
	current := rt.perTunnel[key]
	current.Key = key
	current.Client = client
	current.Tunnel = tunnel
	current.Endpoint = endpoint
	current.Listen = listen
	current.State = state
	current.Error = errText
	current.UpdatedAt = time.Now().UTC()
	rt.perTunnel[key] = current
}

func (rt *Runtime) IncTunnelConnections(client, tunnel, endpoint, listen string) {
	key := clientTunnelKey(client, tunnel)
	rt.mu.Lock()
	defer rt.mu.Unlock()
	current := rt.perTunnel[key]
	current.Key = key
	current.Client = client
	current.Tunnel = tunnel
	current.Endpoint = endpoint
	current.Listen = listen
	current.ActiveConnections++
	if current.State == "" {
		current.State = "listening"
	}
	current.UpdatedAt = time.Now().UTC()
	rt.perTunnel[key] = current
}

func (rt *Runtime) DecTunnelConnections(client, tunnel string) {
	key := clientTunnelKey(client, tunnel)
	rt.mu.Lock()
	defer rt.mu.Unlock()
	current, ok := rt.perTunnel[key]
	if !ok {
		return
	}
	if current.ActiveConnections > 0 {
		current.ActiveConnections--
	}
	current.UpdatedAt = time.Now().UTC()
	rt.perTunnel[key] = current
}

// RemoveTunnel drops the runtime entry for a tunnel that's no longer
// desired (profile renamed/deleted, tunnel removed). Idempotent.
func (rt *Runtime) RemoveTunnel(client, tunnel string) {
	key := clientTunnelKey(client, tunnel)
	rt.mu.Lock()
	delete(rt.perTunnel, key)
	rt.mu.Unlock()
}

func (rt *Runtime) TunnelStatuses() []TunnelStatus {
	rt.mu.RLock()
	defer rt.mu.RUnlock()
	out := make([]TunnelStatus, 0, len(rt.perTunnel))
	for _, status := range rt.perTunnel {
		out = append(out, status)
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Client == out[j].Client {
			return out[i].Tunnel < out[j].Tunnel
		}
		return out[i].Client < out[j].Client
	})
	return out
}

// StartedAt is recorded once at process boot for uptime reporting.
var startedAt = time.Now()

// Uptime returns time since process start.
func Uptime() time.Duration { return time.Since(startedAt) }
