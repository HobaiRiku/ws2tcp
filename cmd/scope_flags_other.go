//go:build !windows

package cmd

import "github.com/spf13/cobra"

// registerScopeFlags adds --user on platforms that support a per-user service
// (systemd user unit on Linux, launchd agent on macOS). System scope stays
// the default; --user opts into the per-user install.
func registerScopeFlags(root *cobra.Command) {
	root.PersistentFlags().BoolVar(&rootFlags.User, "user", false,
		"manage a per-user service instead of the system-wide default")
}
