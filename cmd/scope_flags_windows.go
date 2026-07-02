//go:build windows

package cmd

import "github.com/spf13/cobra"

// Windows has no per-user service scope; ws2tcp always manages the system-wide
// Windows service, so no --user flag is registered and rootFlags.User stays
// false (rootScope then always resolves to system).
func registerScopeFlags(*cobra.Command) {}
