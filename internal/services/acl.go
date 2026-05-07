package services

import (
	"context"
	"fmt"
	"net"
	"net/netip"

	"websocket2Tcp/internal/config"
)

// HostResolver looks up a target hostname. Pluggable so tests can inject
// fixed answers. The default uses net.DefaultResolver.
type HostResolver interface {
	LookupNetIP(ctx context.Context, network, host string) ([]netip.Addr, error)
}

type defaultResolver struct{}

func (defaultResolver) LookupNetIP(ctx context.Context, network, host string) ([]netip.Addr, error) {
	return net.DefaultResolver.LookupNetIP(ctx, network, host)
}

// Allows reports whether id may connect to (targetHost, targetPort) per its
// ACL. Strict mode (default): targetHost is resolved (or parsed if literal)
// and *every* resolved address must satisfy at least one rule. Pass nil for
// resolver to use the default.
//
// 空 ACL 表示该 client 不设访问限制, 直接放行 (常见于本机自测 / 内网默认信任
// 场景). 这意味着没有 ACL 也能用; 一旦写了规则, 就按 strict-AND 严格判定:
// dual-stack 主机名解析出多条地址时, 每一条都必须落到至少一条规则里, 否则
// 视为有"逃逸"地址, 整体拒绝 (例如规则只写了 127.0.0.0/8 而 localhost 解析
// 到 ::1 时就会被拒, 这是有意为之的安全语义).
//
// targetHost may be an IP literal or a DNS name.
func (r *Registry) Allows(ctx context.Context, id Identity, targetHost string, targetPort uint16, resolver HostResolver) (bool, error) {
	if len(id.ACL) == 0 {
		return true, nil
	}
	if resolver == nil {
		resolver = defaultResolver{}
	}
	addrs, err := resolveTarget(ctx, resolver, targetHost)
	if err != nil {
		return false, err
	}
	if len(addrs) == 0 {
		return false, fmt.Errorf("target %q resolved to no addresses", targetHost)
	}
	for _, addr := range addrs {
		if !ruleSetMatches(id.ACL, addr, targetPort) {
			return false, nil
		}
	}
	return true, nil
}

func resolveTarget(ctx context.Context, r HostResolver, host string) ([]netip.Addr, error) {
	if addr, err := netip.ParseAddr(host); err == nil {
		return []netip.Addr{addr}, nil
	}
	addrs, err := r.LookupNetIP(ctx, "ip", host)
	if err != nil {
		return nil, fmt.Errorf("lookup %q: %w", host, err)
	}
	return addrs, nil
}

func ruleSetMatches(rules []ParsedACLRule, addr netip.Addr, port uint16) bool {
	addr = addr.Unmap() // normalise IPv4-in-IPv6 so prefix.Contains works
	for _, rule := range rules {
		if rule.CIDR.Contains(addr) && portInRanges(rule.Ports, port) {
			return true
		}
	}
	return false
}

func portInRanges(ranges []config.PortRange, p uint16) bool {
	for _, r := range ranges {
		if r.Contains(p) {
			return true
		}
	}
	return false
}
