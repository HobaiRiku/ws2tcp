package services

import (
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
	bytesIn  atomic.Uint64
	bytesOut atomic.Uint64

	mu        sync.RWMutex
	perClient map[string]int32 // identity ID -> live connections
}

// NewRuntime constructs an empty Runtime.
func NewRuntime() *Runtime {
	return &Runtime{perClient: map[string]int32{}}
}

// AddBytesIn / AddBytesOut accumulate transfer counters.
func (rt *Runtime) AddBytesIn(n uint64)  { rt.bytesIn.Add(n) }
func (rt *Runtime) AddBytesOut(n uint64) { rt.bytesOut.Add(n) }

// Totals returns (bytesIn, bytesOut) atomically.
func (rt *Runtime) Totals() (uint64, uint64) {
	return rt.bytesIn.Load(), rt.bytesOut.Load()
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

// StartedAt is recorded once at process boot for uptime reporting.
var startedAt = time.Now()

// Uptime returns time since process start.
func Uptime() time.Duration { return time.Since(startedAt) }
