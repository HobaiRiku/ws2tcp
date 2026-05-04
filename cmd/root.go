// Package cmd hosts the cobra command tree. main.go invokes Execute().
package cmd

import (
	"github.com/spf13/cobra"
)

// rootFlags carries values shared by every subcommand. We keep them on a
// package var (rather than a builder pattern) because cobra binds flags by
// pointer at registration time.
var rootFlags struct {
	Home string
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
	}
	root.PersistentFlags().StringVar(&rootFlags.Home, "home", "",
		"override WS2TCP_HOME (default $HOME/.ws2tcp)")

	root.AddCommand(
		runCmd(),
		installCmd(),
		uninstallCmd(),
		startCmd(),
		stopCmd(),
		statusCmd(),
		versionCmd(),
	)
	return root
}

// Execute runs the root command. main.go calls this and exits with the
// returned code. Returning rather than os.Exiting keeps tests possible.
func Execute() error {
	return Root().Execute()
}
