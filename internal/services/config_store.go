package services

import (
	"bytes"
	"fmt"

	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
)

func (r *Registry) mutateConfig(mutator func(doc *yaml.Node) error) error {
	if r.configPath == "" {
		return fmt.Errorf("registry is not backed by a config file")
	}

	r.storeMu.Lock()
	defer r.storeMu.Unlock()

	doc, err := config.LoadNode(r.configPath)
	if err != nil {
		return err
	}
	backup, err := cloneNode(doc)
	if err != nil {
		return err
	}

	if err := mutator(doc); err != nil {
		return err
	}
	if err := config.SaveNode(r.configPath, doc, r.fileMode); err != nil {
		return err
	}

	nextCfg, err := config.Load(r.configPath)
	if err != nil {
		_ = config.SaveNode(r.configPath, backup, r.fileMode)
		return err
	}
	if err := r.Apply(nextCfg); err != nil {
		_ = config.SaveNode(r.configPath, backup, r.fileMode)
		return err
	}
	return nil
}

func cloneNode(in *yaml.Node) (*yaml.Node, error) {
	var buf bytes.Buffer
	enc := yaml.NewEncoder(&buf)
	enc.SetIndent(2)
	if err := enc.Encode(in); err != nil {
		_ = enc.Close()
		return nil, fmt.Errorf("encode yaml clone: %w", err)
	}
	if err := enc.Close(); err != nil {
		return nil, fmt.Errorf("close yaml clone encoder: %w", err)
	}

	var out yaml.Node
	if err := yaml.Unmarshal(buf.Bytes(), &out); err != nil {
		return nil, fmt.Errorf("decode yaml clone: %w", err)
	}
	return &out, nil
}

func rootMapping(doc *yaml.Node) (*yaml.Node, error) {
	if doc == nil || len(doc.Content) == 0 {
		return nil, fmt.Errorf("yaml document is empty")
	}
	root := doc.Content[0]
	if root.Kind != yaml.MappingNode {
		return nil, fmt.Errorf("yaml root must be a mapping")
	}
	return root, nil
}

func mappingValue(node *yaml.Node, key string) (*yaml.Node, int, bool) {
	if node == nil || node.Kind != yaml.MappingNode {
		return nil, -1, false
	}
	for i := 0; i+1 < len(node.Content); i += 2 {
		if node.Content[i].Value == key {
			return node.Content[i+1], i + 1, true
		}
	}
	return nil, -1, false
}

func ensureMappingValue(node *yaml.Node, key string, kind yaml.Kind) (*yaml.Node, error) {
	if got, _, ok := mappingValue(node, key); ok {
		if got.Kind != kind {
			return nil, fmt.Errorf("%s must be a %s", key, yamlKindName(kind))
		}
		return got, nil
	}
	value := &yaml.Node{Kind: kind}
	node.Content = append(node.Content, &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: key}, value)
	return value, nil
}

func yamlNodeForValue(v any) (*yaml.Node, error) {
	var doc yaml.Node
	raw, err := yaml.Marshal(v)
	if err != nil {
		return nil, fmt.Errorf("marshal yaml value: %w", err)
	}
	if err := yaml.Unmarshal(raw, &doc); err != nil {
		return nil, fmt.Errorf("unmarshal yaml value: %w", err)
	}
	if len(doc.Content) == 0 {
		return nil, fmt.Errorf("yaml value encoded empty document")
	}
	return doc.Content[0], nil
}

func setMappingValue(node *yaml.Node, key string, value *yaml.Node) {
	if _, idx, ok := mappingValue(node, key); ok {
		node.Content[idx] = value
		return
	}
	node.Content = append(node.Content, &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: key}, value)
}

func yamlKindName(kind yaml.Kind) string {
	switch kind {
	case yaml.MappingNode:
		return "mapping"
	case yaml.SequenceNode:
		return "sequence"
	case yaml.ScalarNode:
		return "scalar"
	default:
		return "node"
	}
}
