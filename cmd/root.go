// Package cmd hosts the cobra command tree. main.go invokes Execute().
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/version"
)

// rootFlags carries values shared by every subcommand. We keep them on a
// package var (rather than a builder pattern) because cobra binds flags by
// pointer at registration time.
var rootFlags struct {
	Home string
	User bool
}

// rootScope returns the service scope selected by the current flags.
// System is the default on every platform; --user opts into the per-user
// install (the flag is not registered on Windows, so User stays false there).
func rootScope() string {
	if rootFlags.User {
		return paths.ScopeUser
	}
	return paths.ScopeSystem
}

// Root returns the root cobra command, fully wired with subcommands.
func Root() *cobra.Command {
	root := &cobra.Command{
		Use:   "ws2tcp",
		Short: "WebSocket-to-TCP tunnel: server + client in one binary",
		Long: "ws2tcp tunnels TCP traffic over WebSocket. The same binary can run as " +
			"a server (terminate WS, dial target TCP), a client (local TCP listener -> " +
			"WS dial), or both, configured via ~/.ws2tcp/config.yaml.",
		SilenceUsage:  true,
		SilenceErrors: false,
		Run: func(c *cobra.Command, _ []string) {
			if showVer, _ := c.Flags().GetBool("version"); showVer {
				fmt.Println(version.String())
				return
			}
			_ = c.Help()
		},
	}
	root.PersistentFlags().StringVar(&rootFlags.Home, "home", "",
		"override WS2TCP_HOME; if unset, defaults to the system home (e.g. /var/lib/ws2tcp), or the per-user home ($HOME/.ws2tcp) when --user is set")
	// System scope is the default on every platform; --user (registered per
	// platform below) opts into a per-user install. Windows has no user scope,
	// so the flag is omitted there.
	registerScopeFlags(root)
	root.Flags().BoolP("version", "v", false, "print version and exit")

	root.AddCommand(
		runCmd(),
		tailCmd(),
		installCmd(),
		uninstallCmd(),
		startCmd(),
		stopCmd(),
		statusCmd(),
		serverCmd(),
		serverClientCmd(),
		endpointCmd(),
		clientCmd(),
		tunnelCmd(),
		configCmd(),
		versionCmd(),
	)
	return root
}

// Execute runs the root command. main.go calls this and exits with the
// returned code. Returning rather than os.Exiting keeps tests possible.
func Execute() error {
	return Root().Execute()
}
