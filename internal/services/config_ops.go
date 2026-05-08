package services

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
)

// ConfigPath returns the on-disk config file path backing the registry.
func (r *Registry) ConfigPath() string {
	return r.configPath
}

// SetClientCredentials updates the selected client profile credentials.
func (r *Registry) SetClientCredentials(clientName, clientID, clientSecret string) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		client, err := findConfiguredClientNode(doc, clientName)
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
			var value *yaml.Node
			switch node.Kind {
			case yaml.MappingNode:
				var ok bool
				value, _, ok = mappingValue(node, part)
				if !ok {
					// 仅在最后一段允许 upsert: 给老 config 升级时新增的字段
					// (如 server.enabled) 提供平滑路径, 同时保留中间路径必须
					// 存在的约束以防止 typo 创建出整棵未知子树.
					if i != len(parts)-1 {
						return fmt.Errorf("config path %q not found", path)
					}
					keyNode := &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: part}
					valNode := &yaml.Node{Kind: yaml.ScalarNode, Tag: inferScalarTag(raw), Value: ""}
					node.Content = append(node.Content, keyNode, valNode)
					value = valNode
				}
			case yaml.SequenceNode:
				idx, err := strconv.Atoi(part)
				if err != nil || idx < 0 || idx >= len(node.Content) {
					return fmt.Errorf("config path %q not found", path)
				}
				value = node.Content[idx]
			default:
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
			if value.Kind != yaml.MappingNode && value.Kind != yaml.SequenceNode {
				return fmt.Errorf("config path %q does not resolve to a mapping or sequence", strings.Join(parts[:i+1], "."))
			}
			node = value
		}
		return nil
	})
}

// inferScalarTag 给 upsert 出来的新 scalar 选一个合适的 YAML tag,
// 让 parseScalarValue 走到对应的分支 (bool/int/str). 启发式而非严格,
// 没识别出来就当字符串 — PATCH 来源是受信任的管理 API, 不会搞坏什么.
func inferScalarTag(raw string) string {
	switch strings.ToLower(raw) {
	case "true", "false":
		return "!!bool"
	}
	if _, err := strconv.Atoi(raw); err == nil {
		return "!!int"
	}
	return "!!str"
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

// ReplaceConfig overwrites the backing config file with a new full document,
// validates it through the normal load path, then swaps the runtime snapshot.
func (r *Registry) ReplaceConfig(next *config.Config) error {
	if r.configPath == "" {
		return fmt.Errorf("registry is not backed by a config file")
	}
	raw, err := yaml.Marshal(next)
	if err != nil {
		return fmt.Errorf("marshal config: %w", err)
	}

	r.storeMu.Lock()
	defer r.storeMu.Unlock()

	backup, err := os.ReadFile(r.configPath)
	if err != nil {
		return fmt.Errorf("read config backup: %w", err)
	}
	if err := config.WriteAtomic(r.configPath, raw, r.fileMode); err != nil {
		return err
	}
	loaded, err := config.Load(r.configPath)
	if err != nil {
		_ = config.WriteAtomic(r.configPath, backup, r.fileMode)
		return err
	}
	if err := r.Apply(loaded); err != nil {
		_ = config.WriteAtomic(r.configPath, backup, r.fileMode)
		return err
	}
	return nil
}
