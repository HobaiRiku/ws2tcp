package services

import (
	"fmt"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/config"
)

// Endpoints returns a snapshot of configured client-side endpoints.
func (r *Registry) Endpoints() []config.Endpoint {
	s := r.snap()
	out := make([]config.Endpoint, 0, len(s.endpoints))
	for _, ep := range s.endpoints {
		out = append(out, ep)
	}
	return out
}

// FindEndpoint returns the named endpoint or an error.
func (r *Registry) FindEndpoint(name string) (config.Endpoint, error) {
	s := r.snap()
	ep, ok := s.endpoints[name]
	if !ok {
		return config.Endpoint{}, fmt.Errorf("endpoint %q not found", name)
	}
	return ep, nil
}

// Tunnels returns a snapshot of configured client-side tunnels.
func (r *Registry) Tunnels() []config.Tunnel {
	s := r.snap()
	out := make([]config.Tunnel, len(s.tunnels))
	copy(out, s.tunnels)
	return out
}

// FindTunnel returns the named tunnel or an error.
func (r *Registry) FindTunnel(name string) (config.Tunnel, error) {
	s := r.snap()
	for _, t := range s.tunnels {
		if t.Name == name {
			return t, nil
		}
	}
	return config.Tunnel{}, fmt.Errorf("tunnel %q not found", name)
}

// ResolveTunnelEndpoint returns the endpoint that backs the named tunnel.
// Returns an error if either the tunnel or the referenced endpoint is
// missing — in practice this only fires after a misconfigured Apply.
func (r *Registry) ResolveTunnelEndpoint(tunnelName string) (config.Tunnel, config.Endpoint, error) {
	t, err := r.FindTunnel(tunnelName)
	if err != nil {
		return config.Tunnel{}, config.Endpoint{}, err
	}
	ep, err := r.FindEndpoint(t.Endpoint)
	if err != nil {
		return t, config.Endpoint{}, fmt.Errorf("tunnel %q references unknown endpoint %q",
			tunnelName, t.Endpoint)
	}
	return t, ep, nil
}
