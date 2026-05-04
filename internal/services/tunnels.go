package services

import (
	"fmt"

	"websocket2Tcp/internal/config"
)

// ClientCredentials is the shared ws2tcp-client authentication pair used by
// every tunnel handshake in the current client process.
type ClientCredentials struct {
	ClientID     string
	ClientSecret string
}

// ClientEndpoint returns the shared client-scope upstream endpoint.
func (r *Registry) ClientEndpoint() config.Endpoint {
	return r.snap().endpoint
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

// ClientCredentials returns the configured client-scope auth pair.
func (r *Registry) ClientCredentials() ClientCredentials {
	s := r.snap()
	return ClientCredentials{
		ClientID:     s.clientID,
		ClientSecret: s.clientSecret,
	}
}
