package services

import (
	"fmt"
	"strconv"
	"strings"

	"gopkg.in/yaml.v3"
)

// ConfigPath returns the on-disk config file path backing the registry.
func (r *Registry) ConfigPath() string {
	return r.configPath
}

// SetClientCredentials updates client.client_id and client.client_secret.
func (r *Registry) SetClientCredentials(clientID, clientSecret string) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findClientMapping(doc)
		if err != nil {
			return err
		}
		setMappingValue(client, "client_id", &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: clientID})
		setMappingValue(client, "client_secret", &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: clientSecret})
		return nil
	})
}

// SetConfigValue updates an existing scalar key addressed as a dotted path.
// Only existing scalar nodes are supported; sequences and mappings must be
// edited through dedicated service methods.
func (r *Registry) SetConfigValue(path string, raw string) error {
	parts := strings.Split(path, ".")
	if len(parts) == 0 {
		return fmt.Errorf("config path is empty")
	}

	return r.mutateConfig(func(doc *yaml.Node) error {
		node, err := rootMapping(doc)
		if err != nil {
			return err
		}

		for i, part := range parts {
			value, _, ok := mappingValue(node, part)
			if !ok {
				return fmt.Errorf("config path %q not found", path)
			}
			if i == len(parts)-1 {
				if value.Kind != yaml.ScalarNode {
					return fmt.Errorf("config path %q is not a scalar value", path)
				}
				tag, val, err := parseScalarValue(value, raw)
				if err != nil {
					return err
				}
				value.Tag = tag
				value.Value = val
				return nil
			}
			if value.Kind != yaml.MappingNode {
				return fmt.Errorf("config path %q does not resolve to a mapping", strings.Join(parts[:i+1], "."))
			}
			node = value
		}
		return nil
	})
}

func parseScalarValue(existing *yaml.Node, raw string) (string, string, error) {
	tag := existing.Tag
	if tag == "" {
		tag = "!!str"
	}

	switch tag {
	case "!!bool":
		switch strings.ToLower(raw) {
		case "true":
			return tag, "true", nil
		case "false":
			return tag, "false", nil
		default:
			return "", "", fmt.Errorf("invalid bool value %q", raw)
		}
	case "!!int":
		n, err := strconv.Atoi(raw)
		if err != nil {
			return "", "", fmt.Errorf("invalid int value %q", raw)
		}
		return tag, strconv.Itoa(n), nil
	default:
		return "!!str", raw, nil
	}
}
