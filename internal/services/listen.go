package services

import (
	"errors"
	"fmt"
	"log/slog"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"

	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/pid"
)

// listenProbe is the function used to detect "port already used by another
// process". It is package-level so tests can stub it without spinning up
// real listeners. Default: try a transient bind on the address; if it
// succeeds we close immediately. The window between the probe close and
// the manager's real bind is racy by definition — this is a "fail fast at
// the API" convenience, not a guarantee.
var listenProbe = probeBind

// validateListenFormat checks the host:port shape and port range. It does
// not touch the network. host="" / "0.0.0.0" / "::" / "[::]" are accepted
// as wildcards; non-empty hosts must be either an IP literal, "localhost",
// or a valid DNS hostname.
func validateListenFormat(addr string) error {
	if strings.TrimSpace(addr) == "" {
		return errors.New("listen required")
	}
	host, portStr, err := net.SplitHostPort(addr)
	if err != nil {
		return fmt.Errorf("invalid listen %q: %w (expected host:port)", addr, err)
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return fmt.Errorf("invalid listen %q: port not numeric", addr)
	}
	// port 0 在 net.Listen 语义里是 "OS 任选一个临时端口", 对一个长期运行的
	// tunnel 没有意义 — 用户填 0 八成是手滑或没填. 直接拒绝.
	if port <= 0 || port > 65535 {
		return fmt.Errorf("invalid listen %q: port must be 1-65535", addr)
	}
	host = strings.Trim(host, "[]")
	switch host {
	case "", "0.0.0.0", "::", "localhost":
		return nil
	}
	if ip := net.ParseIP(host); ip != nil {
		return nil
	}
	if !isDNSName(host) {
		return fmt.Errorf("invalid listen %q: host %q is not an IP or DNS name", addr, host)
	}
	return nil
}

// listenConflict scans configured client tunnels for the same Listen value,
// excluding the (skipClient, skipTunnel) pair (so editing a tunnel without
// changing its listen doesn't conflict with itself).
func (r *Registry) listenConflict(skipClient, skipTunnel, listen string) string {
	target := normalizeListen(listen)
	if target == "" {
		return ""
	}
	s := r.snap()
	for _, profile := range s.clientProfiles {
		for _, t := range profile.Tunnels {
			if profile.Name == skipClient && t.Name == skipTunnel {
				continue
			}
			if normalizeListen(t.Listen) == target {
				return profile.Name + "/" + t.Name
			}
		}
	}
	return ""
}

// validateTunnelListen runs format -> intra-config conflict -> external
// port-busy probe. The probe is skipped when listen == currentListen so
// that "no-op" updates and updates that don't touch listen don't trip on
// the manager's own bound listener.
func (r *Registry) validateTunnelListen(skipClient, skipTunnel, listen, currentListen string) error {
	if err := validateListenFormat(listen); err != nil {
		return err
	}
	if conflict := r.listenConflict(skipClient, skipTunnel, listen); conflict != "" {
		return fmt.Errorf("listen %q already used by tunnel %s", listen, conflict)
	}
	if normalizeListen(listen) == normalizeListen(currentListen) {
		return nil
	}
	if err := listenProbe(listen); err != nil {
		if isAddrInUse(err) {
			warnPortConflict(listen)
		}
		return fmt.Errorf("listen %q is not bindable: %w", listen, err)
	}
	return nil
}

// warnPortConflict is a best-effort diagnostic: if the busy port appears to be
// held by a known ws2tcp process, emit a structured Warn so the operator knows
// which instance to stop. Failures are silently ignored.
//
// It is a package-level var so tests can stub it out.
var warnPortConflict = defaultWarnPortConflict

func defaultWarnPortConflict(addr string) {
	_, portStr, err := net.SplitHostPort(addr)
	if err != nil {
		return
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		return
	}

	ownerPID := pid.FindPortOwner(port)
	homes := pid.KnownHomes(paths.SystemHome())

	for _, home := range homes {
		knownPID, err := pid.Read(filepath.Join(home, "ws2tcp.pid"))
		if err != nil {
			continue
		}
		// Attribution: either we matched the port to this PID directly, or
		// on platforms without per-port lookup (non-Linux) we fall back to
		// checking whether any live ws2tcp instance might hold the port.
		// The fallback is a heuristic: a live instance is not guaranteed to
		// own this specific port, so the warning says "may conflict".
		if (ownerPID != 0 && knownPID == ownerPID) || (ownerPID == 0 && pid.IsAlive(knownPID)) {
			slog.Default().Warn("port may conflict with running ws2tcp instance",
				"addr", addr, "pid", knownPID, "home", home)
			return
		}
	}
}

func probeBind(addr string) error {
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	return ln.Close()
}

func normalizeListen(addr string) string {
	host, port, err := net.SplitHostPort(addr)
	if err != nil {
		return strings.TrimSpace(addr)
	}
	host = strings.TrimSpace(host)
	host = strings.Trim(host, "[]")
	switch host {
	case "0.0.0.0", "::", "":
		host = "*"
	}
	return host + ":" + port
}

// isDNSName is a minimal RFC-1035 hostname check — labels of letters,
// digits, hyphen (no leading/trailing hyphen), separated by dots, ≤253 chars.
func isDNSName(s string) bool {
	if len(s) == 0 || len(s) > 253 {
		return false
	}
	for _, label := range strings.Split(s, ".") {
		if len(label) == 0 || len(label) > 63 {
			return false
		}
		if label[0] == '-' || label[len(label)-1] == '-' {
			return false
		}
		for _, r := range label {
			ok := (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-'
			if !ok {
				return false
			}
		}
	}
	return true
}

// isErrno unwraps err and reports whether the innermost error equals target.
// Handles *net.OpError → *os.SyscallError → syscall.Errno chains.
func isErrno(err error, target syscall.Errno) bool {
	var syscallErr *os.SyscallError
	if errors.As(err, &syscallErr) {
		return errors.Is(syscallErr.Err, target)
	}
	var opErr *net.OpError
	if errors.As(err, &opErr) {
		return isErrno(opErr.Err, target)
	}
	return errors.Is(err, target)
}
