package services

import (
	"fmt"

	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
)

// Endpoints returns a snapshot of configured reusable client-side endpoints.
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

// ClientProfiles returns configured client definitions.
func (r *Registry) ClientProfiles() []config.ClientProfile {
	s := r.snap()
	out := make([]config.ClientProfile, len(s.clientProfiles))
	copy(out, s.clientProfiles)
	for i := range out {
		out[i].Tunnels = append([]config.Tunnel(nil), out[i].Tunnels...)
	}
	return out
}

// FindClientProfile returns the named client definition.
func (r *Registry) FindClientProfile(name string) (config.ClientProfile, error) {
	s := r.snap()
	profile, ok := s.clientByName[name]
	if !ok {
		return config.ClientProfile{}, fmt.Errorf("client profile %q not found", name)
	}
	cp := *profile
	cp.Tunnels = append([]config.Tunnel(nil), profile.Tunnels...)
	return cp, nil
}

// ClientEndpoint resolves the reusable endpoint referenced by the named client.
func (r *Registry) ClientEndpoint(clientName string) (config.Endpoint, error) {
	profile, err := r.FindClientProfile(clientName)
	if err != nil {
		return config.Endpoint{}, err
	}
	ep, err := r.FindEndpoint(profile.Endpoint)
	if err != nil {
		return config.Endpoint{}, fmt.Errorf("client profile %q references unknown endpoint %q", clientName, profile.Endpoint)
	}
	return ep, nil
}

// Tunnels returns the configured tunnels owned by the named client.
func (r *Registry) Tunnels(clientName string) ([]config.Tunnel, error) {
	profile, err := r.FindClientProfile(clientName)
	if err != nil {
		return nil, err
	}
	out := make([]config.Tunnel, len(profile.Tunnels))
	copy(out, profile.Tunnels)
	return out, nil
}

// FindTunnel returns one tunnel owned by the named client.
func (r *Registry) FindTunnel(clientName, name string) (config.Tunnel, error) {
	profile, err := r.FindClientProfile(clientName)
	if err != nil {
		return config.Tunnel{}, err
	}
	for _, t := range profile.Tunnels {
		if t.Name == name {
			return t, nil
		}
	}
	return config.Tunnel{}, fmt.Errorf("tunnel %q not found for client %q", name, clientName)
}

// ClientCredentials returns the configured auth pair for the named client.
func (r *Registry) ClientCredentials(clientName string) (ClientCredentials, error) {
	profile, err := r.FindClientProfile(clientName)
	if err != nil {
		return ClientCredentials{}, err
	}
	return ClientCredentials{
		ClientID:     profile.ClientID,
		ClientSecret: profile.ClientSecret,
	}, nil
}

// SetClientEndpoint replaces the endpoint fields used by the named client's
// referenced reusable endpoint. The endpoint name itself remains stable.
func (r *Registry) SetClientEndpoint(clientName string, endpoint config.Endpoint) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		profile, err := findConfiguredClientNode(doc, clientName)
		if err != nil {
			return err
		}
		endpointRef, _, ok := mappingValue(profile, "endpoint")
		if !ok || endpointRef.Kind != yaml.ScalarNode || endpointRef.Value == "" {
			return fmt.Errorf("client profile %q endpoint reference not found", clientName)
		}
		endpoint.Name = endpointRef.Value
		node, err := yamlNodeForValue(endpoint)
		if err != nil {
			return err
		}

		section, err := findClientSectionMapping(doc)
		if err != nil {
			return err
		}
		endpoints, _, ok := mappingValue(section, "endpoints")
		if !ok || endpoints.Kind != yaml.SequenceNode {
			return fmt.Errorf("endpoint %q not found", endpointRef.Value)
		}
		for i, existing := range endpoints.Content {
			if endpointNodeName(existing) == endpointRef.Value {
				endpoints.Content[i] = node
				return nil
			}
		}
		return fmt.Errorf("endpoint %q not found", endpointRef.Value)
	})
}

// TunnelPatch allows partial updates to an existing tunnel.
type TunnelPatch struct {
	Listen     *string
	TargetHost *string
	TargetPort *int
}

func findClientSectionMapping(doc *yaml.Node) (*yaml.Node, error) {
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

func findConfiguredClientNode(doc *yaml.Node, clientName string) (*yaml.Node, error) {
	client, err := findClientSectionMapping(doc)
	if err != nil {
		return nil, err
	}
	clients, _, ok := mappingValue(client, "clients")
	if !ok || clients.Kind != yaml.SequenceNode {
		return nil, fmt.Errorf("client profile %q not found", clientName)
	}
	for _, node := range clients.Content {
		if clientProfileNodeName(node) == clientName {
			return node, nil
		}
	}
	return nil, fmt.Errorf("client profile %q not found", clientName)
}

func endpointNodeName(node *yaml.Node) string {
	if node == nil || node.Kind != yaml.MappingNode {
		return ""
	}
	name, _, ok := mappingValue(node, "name")
	if !ok || name.Kind != yaml.ScalarNode {
		return ""
	}
	return name.Value
}

func clientProfileNodeName(node *yaml.Node) string {
	if node == nil || node.Kind != yaml.MappingNode {
		return ""
	}
	name, _, ok := mappingValue(node, "name")
	if !ok || name.Kind != yaml.ScalarNode {
		return ""
	}
	return name.Value
}

// CreateTunnel appends a new tunnel to client.clients[*].tunnels.
func (r *Registry) CreateTunnel(clientName string, t config.Tunnel) error {
	if _, err := r.FindTunnel(clientName, t.Name); err == nil {
		return fmt.Errorf("tunnel %q already exists for client %q", t.Name, clientName)
	}
	item, err := yamlNodeForValue(t)
	if err != nil {
		return err
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		profile, err := findConfiguredClientNode(doc, clientName)
		if err != nil {
			return err
		}
		tunnels, err := ensureMappingValue(profile, "tunnels", yaml.SequenceNode)
		if err != nil {
			return err
		}
		for _, existing := range tunnels.Content {
			nameNode, _, ok := mappingValue(existing, "name")
			if ok && nameNode.Kind == yaml.ScalarNode && nameNode.Value == t.Name {
				return fmt.Errorf("tunnel %q already exists for client %q", t.Name, clientName)
			}
		}
		tunnels.Content = append(tunnels.Content, item)
		return nil
	})
}

// UpdateTunnel updates mutable fields of an existing tunnel.
func (r *Registry) UpdateTunnel(clientName, name string, patch TunnelPatch) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		profile, err := findConfiguredClientNode(doc, clientName)
		if err != nil {
			return err
		}
		tunnels, _, ok := mappingValue(profile, "tunnels")
		if !ok || tunnels.Kind != yaml.SequenceNode {
			return fmt.Errorf("tunnel %q not found for client %q", name, clientName)
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
		return fmt.Errorf("tunnel %q not found for client %q", name, clientName)
	})
}

// DeleteTunnel removes a tunnel by name from client.clients[*].tunnels.
func (r *Registry) DeleteTunnel(clientName, name string) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		profile, err := findConfiguredClientNode(doc, clientName)
		if err != nil {
			return err
		}
		tunnels, _, ok := mappingValue(profile, "tunnels")
		if !ok || tunnels.Kind != yaml.SequenceNode {
			return fmt.Errorf("tunnel %q not found for client %q", name, clientName)
		}
		for i, node := range tunnels.Content {
			nNode, _, ok := mappingValue(node, "name")
			if ok && nNode.Kind == yaml.ScalarNode && nNode.Value == name {
				tunnels.Content = append(tunnels.Content[:i], tunnels.Content[i+1:]...)
				return nil
			}
		}
		return fmt.Errorf("tunnel %q not found for client %q", name, clientName)
	})
}

func clientTunnelKey(clientName, tunnelName string) string {
	return clientName + "\x00" + tunnelName
}

// ClientTunnelBindings returns every client/tunnel pair with resolved endpoint
// and credentials for the runtime manager.
func (r *Registry) ClientTunnelBindings() []ClientTunnelBinding {
	s := r.snap()
	out := make([]ClientTunnelBinding, 0)
	for _, profile := range s.clientProfiles {
		ep, ok := s.endpoints[profile.Endpoint]
		if !ok {
			continue
		}
		auth := ClientCredentials{
			ClientID:     profile.ClientID,
			ClientSecret: profile.ClientSecret,
		}
		for _, tunnel := range profile.Tunnels {
			out = append(out, ClientTunnelBinding{
				Key:         clientTunnelKey(profile.Name, tunnel.Name),
				ClientName:  profile.Name,
				Tunnel:      tunnel,
				Endpoint:    ep,
				Credentials: auth,
			})
		}
	}
	return out
}
