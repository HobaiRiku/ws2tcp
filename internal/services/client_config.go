package services

import (
	"fmt"

	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
)

type EndpointPatch struct {
	Host                  *string
	IP                    *string
	Port                  *int
	Path                  *string
	WSS                   *bool
	AESKey                *string
	SSLRejectUnauthorized *bool
}

type ClientProfilePatch struct {
	Endpoint     *string
	ClientID     *string
	ClientSecret *string
}

func (r *Registry) CreateEndpoint(endpoint config.Endpoint) error {
	if _, err := r.FindEndpoint(endpoint.Name); err == nil {
		return fmt.Errorf("endpoint %q already exists", endpoint.Name)
	}
	item, err := yamlNodeForValue(endpoint)
	if err != nil {
		return err
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientSectionMapping(doc)
		if err != nil {
			return err
		}
		endpoints, err := ensureMappingValue(client, "endpoints", yaml.SequenceNode)
		if err != nil {
			return err
		}
		for _, existing := range endpoints.Content {
			if endpointNodeName(existing) == endpoint.Name {
				return fmt.Errorf("endpoint %q already exists", endpoint.Name)
			}
		}
		endpoints.Content = append(endpoints.Content, item)
		return nil
	})
}

func (r *Registry) UpdateEndpoint(name string, patch EndpointPatch) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		node, err := findEndpointNode(doc, name)
		if err != nil {
			return err
		}
		if patch.Host != nil {
			setMappingValue(node, "host", scalarString(*patch.Host))
		}
		if patch.IP != nil {
			setMappingValue(node, "ip", scalarString(*patch.IP))
		}
		if patch.Port != nil {
			setMappingValue(node, "port", scalarInt(*patch.Port))
		}
		if patch.Path != nil {
			setMappingValue(node, "path", scalarString(*patch.Path))
		}
		if patch.WSS != nil {
			setMappingValue(node, "wss", scalarBool(*patch.WSS))
		}
		if patch.AESKey != nil {
			setMappingValue(node, "aes_key", scalarString(*patch.AESKey))
		}
		if patch.SSLRejectUnauthorized != nil {
			setMappingValue(node, "ssl_reject_unauthorized", scalarBool(*patch.SSLRejectUnauthorized))
		}
		return nil
	})
}

func (r *Registry) DeleteEndpoint(name string) error {
	if _, err := r.FindEndpoint(name); err != nil {
		return err
	}
	for _, profile := range r.ClientProfiles() {
		if profile.Endpoint == name {
			return fmt.Errorf("endpoint %q is still referenced by client profile %q", name, profile.Name)
		}
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientSectionMapping(doc)
		if err != nil {
			return err
		}
		endpoints, _, ok := mappingValue(client, "endpoints")
		if !ok || endpoints.Kind != yaml.SequenceNode {
			return fmt.Errorf("endpoint %q not found", name)
		}
		for i, node := range endpoints.Content {
			if endpointNodeName(node) == name {
				endpoints.Content = append(endpoints.Content[:i], endpoints.Content[i+1:]...)
				return nil
			}
		}
		return fmt.Errorf("endpoint %q not found", name)
	})
}

func (r *Registry) CreateClientProfile(profile config.ClientProfile) error {
	if _, err := r.FindClientProfile(profile.Name); err == nil {
		return fmt.Errorf("client profile %q already exists", profile.Name)
	}
	item, err := yamlNodeForValue(profile)
	if err != nil {
		return err
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientSectionMapping(doc)
		if err != nil {
			return err
		}
		clients, err := ensureMappingValue(client, "clients", yaml.SequenceNode)
		if err != nil {
			return err
		}
		for _, existing := range clients.Content {
			if clientProfileNodeName(existing) == profile.Name {
				return fmt.Errorf("client profile %q already exists", profile.Name)
			}
		}
		clients.Content = append(clients.Content, item)
		return nil
	})
}

func (r *Registry) UpdateClientProfile(name string, patch ClientProfilePatch) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		node, err := findConfiguredClientNode(doc, name)
		if err != nil {
			return err
		}
		if patch.Endpoint != nil {
			setMappingValue(node, "endpoint", scalarString(*patch.Endpoint))
		}
		if patch.ClientID != nil {
			setMappingValue(node, "client_id", scalarString(*patch.ClientID))
		}
		if patch.ClientSecret != nil {
			setMappingValue(node, "client_secret", scalarString(*patch.ClientSecret))
		}
		return nil
	})
}

func (r *Registry) DeleteClientProfile(name string) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientSectionMapping(doc)
		if err != nil {
			return err
		}
		clients, _, ok := mappingValue(client, "clients")
		if !ok || clients.Kind != yaml.SequenceNode {
			return fmt.Errorf("client profile %q not found", name)
		}
		for i, node := range clients.Content {
			if clientProfileNodeName(node) == name {
				clients.Content = append(clients.Content[:i], clients.Content[i+1:]...)
				return nil
			}
		}
		return fmt.Errorf("client profile %q not found", name)
	})
}

func findEndpointNode(doc *yaml.Node, name string) (*yaml.Node, error) {
	client, err := findClientSectionMapping(doc)
	if err != nil {
		return nil, err
	}
	endpoints, _, ok := mappingValue(client, "endpoints")
	if !ok || endpoints.Kind != yaml.SequenceNode {
		return nil, fmt.Errorf("endpoint %q not found", name)
	}
	for _, node := range endpoints.Content {
		if endpointNodeName(node) == name {
			return node, nil
		}
	}
	return nil, fmt.Errorf("endpoint %q not found", name)
}

func scalarString(value string) *yaml.Node {
	return &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: value}
}

func scalarInt(value int) *yaml.Node {
	return &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!int", Value: fmt.Sprintf("%d", value)}
}

func scalarBool(value bool) *yaml.Node {
	if value {
		return &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!bool", Value: "true"}
	}
	return &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!bool", Value: "false"}
}
