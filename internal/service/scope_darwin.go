//go:build darwin

package service

import "websocket2Tcp/internal/paths"

// defaultScope returns the platform-appropriate default service scope.
// macOS defaults to user scope (per-user launchd agent) to avoid SIP
// restrictions and the complex system domain bootstrap semantics.
func defaultScope() string {
	return paths.ScopeUser
}
