package config

import (
	"fmt"
	"net"
	"strconv"
	"strings"
)

// Validate runs the per-section validators described in
// docs/design/01-config-and-storage.md. The error message lists every
// problem found, not just the first, so users can fix configs in one pass.
func (c *Config) Validate() error {
	var errs []string

	errs = append(errs, c.validateServer()...)
	errs = append(errs, c.validateClient()...)
	errs = append(errs, c.validateApp()...)

	if len(errs) == 0 {
		return nil
	}
	return fmt.Errorf("config invalid:\n  - %s", strings.Join(errs, "\n  - "))
}

func (c *Config) validateApp() []string {
	var errs []string
	if !c.App.HTTPAuth && !isLoopback(c.App.HTTPListen) {
		errs = append(errs, fmt.Sprintf(
			"app.http_auth=false is only allowed when app.http_listen is loopback (got %q)",
			c.App.HTTPListen))
	}
	switch strings.ToLower(c.App.LogLevel) {
	case "debug", "info", "warn", "warning", "error":
	default:
		errs = append(errs, fmt.Sprintf("app.log_level %q invalid (debug|info|warn|error)", c.App.LogLevel))
	}
	return errs
}

func (c *Config) validateServer() []string {
	if !c.Server.Enabled {
		return nil
	}
	var errs []string
	if c.Server.Listen == "" {
		errs = append(errs, "server.listen required when server.enabled")
	}
	if err := validateAESKey(c.Server.AESKey); err != nil {
		errs = append(errs, fmt.Sprintf("server.aes_key: %v", err))
	}
	if c.Server.TLS.Enabled {
		if c.Server.TLS.Cert == "" || c.Server.TLS.Key == "" {
			errs = append(errs, "server.tls.enabled requires both cert and key")
		}
	}

	seenIDs := map[string]bool{}
	for i, cl := range c.Server.Clients {
		prefix := fmt.Sprintf("server.clients[%d]", i)
		if cl.ID == "" {
			errs = append(errs, prefix+".id required")
			continue
		}
		if seenIDs[cl.ID] {
			errs = append(errs, fmt.Sprintf("%s.id %q duplicated", prefix, cl.ID))
		}
		seenIDs[cl.ID] = true
		if cl.Secret == "" {
			errs = append(errs, prefix+".secret required")
		}
		if strings.ContainsAny(cl.ID+cl.Secret, ":") {
			errs = append(errs, fmt.Sprintf("%s id/secret must not contain ':' (handshake delimiter)", prefix))
		}
		for j, rule := range cl.ACL {
			rp := fmt.Sprintf("%s.acl[%d]", prefix, j)
			if _, _, err := net.ParseCIDR(rule.CIDR); err != nil {
				errs = append(errs, fmt.Sprintf("%s.cidr: %v", rp, err))
			}
			for k, p := range rule.Ports {
				if _, err := ParsePortRange(p); err != nil {
					errs = append(errs, fmt.Sprintf("%s.ports[%d]: %v", rp, k, err))
				}
			}
		}
	}
	return errs
}

func (c *Config) validateClient() []string {
	if !c.Client.Enabled {
		return nil
	}
	var errs []string
	if c.Client.ClientID == "" || c.Client.ClientSecret == "" {
		errs = append(errs, "client.client_id and client.client_secret required when client.enabled")
	}
	ep := c.Client.Endpoint
	if ep.Host == "" {
		errs = append(errs, "client.endpoint.host required")
	}
	if ep.Port <= 0 || ep.Port > 65535 {
		errs = append(errs, fmt.Sprintf("client.endpoint.port out of range: %d", ep.Port))
	}
	if ep.Path == "" {
		errs = append(errs, "client.endpoint.path required")
	}
	if err := validateAESKey(ep.AESKey); err != nil {
		errs = append(errs, fmt.Sprintf("client.endpoint.aes_key: %v", err))
	}

	tNames := map[string]bool{}
	for i, t := range c.Client.Tunnels {
		prefix := fmt.Sprintf("client.tunnels[%d]", i)
		if t.Name == "" {
			errs = append(errs, prefix+".name required")
			continue
		}
		if tNames[t.Name] {
			errs = append(errs, fmt.Sprintf("%s.name %q duplicated", prefix, t.Name))
		}
		tNames[t.Name] = true
		if t.Listen == "" {
			errs = append(errs, prefix+".listen required")
		}
		if t.TargetHost == "" {
			errs = append(errs, prefix+".target_host required")
		}
		if t.TargetPort <= 0 || t.TargetPort > 65535 {
			errs = append(errs, fmt.Sprintf("%s.target_port out of range: %d", prefix, t.TargetPort))
		}
	}
	return errs
}

func validateAESKey(key string) error {
	if len(key) != 32 {
		return fmt.Errorf("must be exactly 32 bytes, got %d", len(key))
	}
	return nil
}

func isLoopback(addr string) bool {
	if addr == "" {
		return false
	}
	host, _, err := net.SplitHostPort(addr)
	if err != nil {
		host = addr
	}
	if host == "localhost" {
		return true
	}
	ip := net.ParseIP(host)
	return ip != nil && ip.IsLoopback()
}

// PortRange is an inclusive [Lo, Hi] uint16 range, parsed from ACL strings.
type PortRange struct{ Lo, Hi uint16 }

// Contains reports whether p is in [Lo, Hi].
func (r PortRange) Contains(p uint16) bool { return p >= r.Lo && p <= r.Hi }

// ParsePortRange accepts "22" or "8000-8999" (inclusive). Whitespace ok.
func ParsePortRange(s string) (PortRange, error) {
	s = strings.TrimSpace(s)
	if s == "" {
		return PortRange{}, fmt.Errorf("empty port spec")
	}
	if i := strings.Index(s, "-"); i >= 0 {
		lo, errLo := parsePort(s[:i])
		if errLo != nil {
			return PortRange{}, errLo
		}
		hi, errHi := parsePort(s[i+1:])
		if errHi != nil {
			return PortRange{}, errHi
		}
		if lo > hi {
			return PortRange{}, fmt.Errorf("range lo > hi: %s", s)
		}
		return PortRange{Lo: lo, Hi: hi}, nil
	}
	p, err := parsePort(s)
	if err != nil {
		return PortRange{}, err
	}
	return PortRange{Lo: p, Hi: p}, nil
}

func parsePort(s string) (uint16, error) {
	n, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return 0, fmt.Errorf("not a port: %q", s)
	}
	if n <= 0 || n > 65535 {
		return 0, fmt.Errorf("port out of range: %d", n)
	}
	return uint16(n), nil
}
