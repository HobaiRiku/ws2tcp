package services

import (
	"fmt"

	"gopkg.in/yaml.v3"

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

// SetClientEndpoint replaces the shared client-scope upstream endpoint.
func (r *Registry) SetClientEndpoint(endpoint config.Endpoint) error {
	node, err := yamlNodeForValue(endpoint)
	if err != nil {
		return err
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientMapping(doc)
		if err != nil {
			return err
		}
		setMappingValue(client, "endpoint", node)
		return nil
	})
}

// TunnelPatch allows partial updates to an existing tunnel.
type TunnelPatch struct {
	Listen     *string
	TargetHost *string
	TargetPort *int
}

// findClientMapping locates the top-level 'client' mapping node.
func findClientMapping(doc *yaml.Node) (*yaml.Node, error) {
	root, err := rootMapping(doc)
	if err != nil {
		return nil, err
	}
	client, _, ok := mappingValue(root, "client")
	if !ok || client.Kind != yaml.MappingNode {
		return nil, fmt.Errorf("client config not found")
	}
	return client, nil
}

// CreateTunnel appends a new tunnel to client.tunnels and persists it.
func (r *Registry) CreateTunnel(t config.Tunnel) error {
	if _, err := r.FindTunnel(t.Name); err == nil {
		return fmt.Errorf("tunnel %q already exists", t.Name)
	}
	item, err := yamlNodeForValue(t)
	if err != nil {
		return err
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientMapping(doc)
		if err != nil {
			return err
		}
		tunnels, err := ensureMappingValue(client, "tunnels", yaml.SequenceNode)
		if err != nil {
			return err
		}
		for _, existing := range tunnels.Content {
			nameNode, _, ok := mappingValue(existing, "name")
			if ok && nameNode.Kind == yaml.ScalarNode && nameNode.Value == t.Name {
				return fmt.Errorf("tunnel %q already exists", t.Name)
			}
		}
		tunnels.Content = append(tunnels.Content, item)
		return nil
	})
}

// UpdateTunnel updates mutable fields of an existing tunnel.
func (r *Registry) UpdateTunnel(name string, patch TunnelPatch) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientMapping(doc)
		if err != nil {
			return err
		}
		tunnels, _, ok := mappingValue(client, "tunnels")
		if !ok || tunnels.Kind != yaml.SequenceNode {
			return fmt.Errorf("tunnel %q not found", name)
		}
		for _, node := range tunnels.Content {
			nNode, _, ok := mappingValue(node, "name")
			if !ok || nNode.Kind != yaml.ScalarNode || nNode.Value != name {
				continue
			}
			if patch.Listen != nil {
				setMappingValue(node, "listen", &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: *patch.Listen})
			}
			if patch.TargetHost != nil {
				setMappingValue(node, "target_host", &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: *patch.TargetHost})
			}
			if patch.TargetPort != nil {
				setMappingValue(node, "target_port", &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!int", Value: fmt.Sprintf("%d", *patch.TargetPort)})
			}
			return nil
		}
		return fmt.Errorf("tunnel %q not found", name)
	})
}

// DeleteTunnel removes a tunnel by name from client.tunnels.
func (r *Registry) DeleteTunnel(name string) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientMapping(doc)
		if err != nil {
			return err
		}
		tunnels, _, ok := mappingValue(client, "tunnels")
		if !ok || tunnels.Kind != yaml.SequenceNode {
			return fmt.Errorf("tunnel %q not found", name)
		}
		for i, node := range tunnels.Content {
			nNode, _, ok := mappingValue(node, "name")
			if ok && nNode.Kind == yaml.ScalarNode && nNode.Value == name {
				tunnels.Content = append(tunnels.Content[:i], tunnels.Content[i+1:]...)
				return nil
			}
		}
		return fmt.Errorf("tunnel %q not found", name)
	})
}
