// Package services is the shared abstraction layer that the CLI, the HTTP
// API, and the core protocol packages all call into. Keeping business state
// here (rather than scattered through cmd/ and internal/api/) is what
// guarantees CLI and Web UI cannot drift.
//
// Design: docs/design/04-api-cli-shared-service.md.
package services

import (
	"net/netip"

	"websocket2Tcp/internal/config"
)

// Identity is the parsed, runtime form of one server-side client (a "user").
// Built once at config load; the ACL rules are pre-parsed for hot-path use.
type Identity struct {
	ID     string
	Secret string
	ACL    []ParsedACLRule
}

// ParsedACLRule is the ACL form used at match time. CIDR is a netip.Prefix
// (allocation-free Contains); ports are sorted/merged port ranges.
type ParsedACLRule struct {
	CIDR  netip.Prefix
	Ports []config.PortRange
}

// snapshot is the immutable bundle held behind atomic.Pointer so that ACL
// edits can land while existing connections continue with their old view.
type snapshot struct {
	identities []Identity
	byID       map[string]*Identity
	endpoints  map[string]config.Endpoint
	tunnels    []config.Tunnel
}

