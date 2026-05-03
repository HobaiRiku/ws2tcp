package services

import (
	"fmt"
	"net/netip"
	"sync"
	"sync/atomic"

	"websocket2Tcp/internal/config"
)

// Registry holds the runtime view of config, plus stateful sub-services
// (replay, runtime counters, tokens — added as their consumers come online).
//
// Hot path is lock-free: reads consult an atomic.Pointer[snapshot]. Writes
// go through Apply which builds a new snapshot and Stores it; in-flight
// connections keep the snapshot they were authorized under.
type Registry struct {
	cur atomic.Pointer[snapshot]

	mu       sync.Mutex // guards Apply against concurrent rebuilds
	listeners []func()  // fired after each successful Apply (cheap; for hot reload)
}

// New parses cfg into the initial snapshot and returns a Registry.
// Returns a typed error if any ACL rule fails to parse — config.Validate
// already catches the obvious cases, but parsing is repeated here to
// surface the parsed structures.
func New(cfg *config.Config) (*Registry, error) {
	snap, err := buildSnapshot(cfg)
	if err != nil {
		return nil, err
	}
	r := &Registry{}
	r.cur.Store(snap)
	return r, nil
}

// Apply atomically swaps in the runtime view of newCfg. Listeners are
// fired synchronously after the swap.
func (r *Registry) Apply(newCfg *config.Config) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	snap, err := buildSnapshot(newCfg)
	if err != nil {
		return err
	}
	r.cur.Store(snap)
	for _, fn := range r.listeners {
		fn()
	}
	return nil
}

// OnApply registers a callback fired after each successful Apply.
// Used by core/client to reset affected tunnels on endpoint edits, etc.
func (r *Registry) OnApply(fn func()) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.listeners = append(r.listeners, fn)
}

func (r *Registry) snap() *snapshot { return r.cur.Load() }

// buildSnapshot parses cfg into the immutable runtime view. ACL parsing
// errors are collected and returned together so config can be fixed in
// one pass.
func buildSnapshot(cfg *config.Config) (*snapshot, error) {
	s := &snapshot{
		byID:      map[string]*Identity{},
		endpoints: map[string]config.Endpoint{},
		tunnels:   append([]config.Tunnel(nil), cfg.Client.Tunnels...),
	}
	s.identities = make([]Identity, 0, len(cfg.Server.Clients))

	for i, c := range cfg.Server.Clients {
		rules, err := parseACL(c.ACL)
		if err != nil {
			return nil, fmt.Errorf("server.clients[%d] (%s): %w", i, c.ID, err)
		}
		id := Identity{ID: c.ID, Secret: c.Secret, ACL: rules}
		s.identities = append(s.identities, id)
	}
	// byID points into the identities slice; populate after the slice is final.
	for i := range s.identities {
		s.byID[s.identities[i].ID] = &s.identities[i]
	}

	for _, ep := range cfg.Client.Endpoints {
		s.endpoints[ep.Name] = ep
	}
	return s, nil
}

func parseACL(raw []config.ACLRule) ([]ParsedACLRule, error) {
	out := make([]ParsedACLRule, 0, len(raw))
	for i, r := range raw {
		prefix, err := netip.ParsePrefix(r.CIDR)
		if err != nil {
			return nil, fmt.Errorf("acl[%d].cidr %q: %w", i, r.CIDR, err)
		}
		ports := make([]config.PortRange, 0, len(r.Ports))
		for j, p := range r.Ports {
			pr, err := config.ParsePortRange(p)
			if err != nil {
				return nil, fmt.Errorf("acl[%d].ports[%d]: %w", i, j, err)
			}
			ports = append(ports, pr)
		}
		out = append(out, ParsedACLRule{CIDR: prefix, Ports: ports})
	}
	return out, nil
}
