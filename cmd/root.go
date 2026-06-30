// Package cmd hosts the cobra command tree. main.go invokes Execute().
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	hostservice "websocket2Tcp/internal/service"
	"websocket2Tcp/internal/version"
)

// rootFlags carries values shared by every subcommand. We keep them on a
// package var (rather than a builder pattern) because cobra binds flags by
// pointer at registration time.
var rootFlags struct {
	Home   string
	System bool
}

// rootScope returns the service scope selected by the current flags.
func rootScope() string {
	if rootFlags.System {
		return "system"
	}
	return "user"
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
		"override WS2TCP_HOME (default $HOME/.ws2tcp)")
	// --system defaults to true on Linux/Windows, false on macOS, matching
	// the platform-native service management convention.
	root.PersistentFlags().BoolVar(&rootFlags.System, "system",
		hostservice.DefaultScope() == "system",
		"manage as a system-wide service (default: true on Linux/Windows, false on macOS)")
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
