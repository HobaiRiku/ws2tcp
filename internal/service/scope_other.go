//go:build !darwin

package service

import "websocket2Tcp/internal/paths"

// defaultScope returns the platform-appropriate default service scope.
// Linux and Windows default to system scope: systemd system unit / Windows
// service, which enables boot-time autostart and system-level management.
func defaultScope() string {
	return paths.ScopeSystem
}
