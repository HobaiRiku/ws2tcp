package services

import (
	"crypto/subtle"
	"fmt"
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
