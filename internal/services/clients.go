package services

import (
	"crypto/subtle"
	"fmt"

	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
)

// Verify performs constant-time identity check. Returns the captured
// Identity (a value, not a pointer — safe to retain past Apply swaps).
func (r *Registry) Verify(id, secret string) (Identity, bool) {
	s := r.snap()
	stored, ok := s.byID[id]
	if !ok {
		// Still do a dummy compare to avoid timing-distinguishing absent IDs.
		subtle.ConstantTimeCompare([]byte("x"), []byte("x"))
		return Identity{}, false
	}
	if subtle.ConstantTimeCompare([]byte(stored.Secret), []byte(secret)) != 1 {
		return Identity{}, false
	}
	// Return a copy so callers can hold across Apply.
	cp := *stored
	cp.ACL = append([]ParsedACLRule(nil), stored.ACL...)
	return cp, true
}

// Identities returns a snapshot copy of all server-side identities.
// Used by CLI `ws2tcp server users` and the API list endpoint.
func (r *Registry) Identities() []Identity {
	s := r.snap()
	out := make([]Identity, len(s.identities))
	copy(out, s.identities)
	return out
}

// FindIdentity returns the named identity if present.
func (r *Registry) FindIdentity(id string) (Identity, error) {
	s := r.snap()
	stored, ok := s.byID[id]
	if !ok {
		return Identity{}, fmt.Errorf("client %q not found", id)
	}
	return *stored, nil
}

// ClientPatch updates mutable fields of a server-side identity. Nil fields are
// left unchanged.
type ClientPatch struct {
	Secret *string
	ACL    *[]config.ACLRule
}

// CreateClient appends a new server-side identity to server.clients, persists
// it to config.yaml, then applies the rebuilt runtime snapshot.
func (r *Registry) CreateClient(client config.ClientIdentity) error {
	if _, err := r.FindIdentity(client.ID); err == nil {
		return fmt.Errorf("client %q already exists", client.ID)
	}

	item, err := yamlNodeForValue(client)
	if err != nil {
		return err
	}
	return r.mutateConfig(func(doc *yaml.Node) error {
		root, err := rootMapping(doc)
		if err != nil {
			return err
		}
		server, err := ensureMappingValue(root, "server", yaml.MappingNode)
		if err != nil {
			return err
		}
		clients, err := ensureMappingValue(server, "clients", yaml.SequenceNode)
		if err != nil {
			return err
		}
		for _, existing := range clients.Content {
			if clientNodeID(existing) == client.ID {
				return fmt.Errorf("client %q already exists", client.ID)
			}
		}
		clients.Content = append(clients.Content, item)
		return nil
	})
}

// UpdateClient mutates the secret and/or ACL of an existing server-side
// identity. The client ID is stable and not renameable.
func (r *Registry) UpdateClient(id string, patch ClientPatch) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		clientNode, err := findClientNode(doc, id)
		if err != nil {
			return err
		}

		if patch.Secret != nil {
			setMappingValue(clientNode, "secret", &yaml.Node{
				Kind:  yaml.ScalarNode,
				Tag:   "!!str",
				Value: *patch.Secret,
			})
		}
		if patch.ACL != nil {
			aclNode, err := yamlNodeForValue(*patch.ACL)
			if err != nil {
				return err
			}
			setMappingValue(clientNode, "acl", aclNode)
		}
		return nil
	})
}

// DeleteClient removes a server-side identity from server.clients.
func (r *Registry) DeleteClient(id string) error {
	return r.mutateConfig(func(doc *yaml.Node) error {
		root, err := rootMapping(doc)
		if err != nil {
			return err
		}
		server, _, ok := mappingValue(root, "server")
		if !ok || server.Kind != yaml.MappingNode {
			return fmt.Errorf("client %q not found", id)
		}
		clients, _, ok := mappingValue(server, "clients")
		if !ok || clients.Kind != yaml.SequenceNode {
			return fmt.Errorf("client %q not found", id)
		}

		for i, node := range clients.Content {
			if clientNodeID(node) == id {
				clients.Content = append(clients.Content[:i], clients.Content[i+1:]...)
				return nil
			}
		}
		return fmt.Errorf("client %q not found", id)
	})
}

// SetClientACL replaces the ACL rules of an existing server-side identity.
func (r *Registry) SetClientACL(id string, rules []config.ACLRule) error {
	return r.UpdateClient(id, ClientPatch{ACL: &rules})
}

func findClientNode(doc *yaml.Node, id string) (*yaml.Node, error) {
	root, err := rootMapping(doc)
	if err != nil {
		return nil, err
	}
	server, _, ok := mappingValue(root, "server")
	if !ok || server.Kind != yaml.MappingNode {
		return nil, fmt.Errorf("client %q not found", id)
	}
	clients, _, ok := mappingValue(server, "clients")
	if !ok || clients.Kind != yaml.SequenceNode {
		return nil, fmt.Errorf("client %q not found", id)
	}
	for _, node := range clients.Content {
		if clientNodeID(node) == id {
			return node, nil
		}
	}
	return nil, fmt.Errorf("client %q not found", id)
}

func clientNodeID(node *yaml.Node) string {
	if node == nil || node.Kind != yaml.MappingNode {
		return ""
	}
	idNode, _, ok := mappingValue(node, "id")
	if !ok || idNode.Kind != yaml.ScalarNode {
		return ""
	}
	return idNode.Value
}
