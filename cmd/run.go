package cmd

import (
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"

	hostservice "gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/service"
)

func runCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "run",
		Short: "Run ws2tcp in the foreground",
		Long: "Loads ~/.ws2tcp/config.yaml (or $WS2TCP_HOME), starts every enabled " +
			"subsystem (server, client tunnels), and blocks until SIGINT/SIGTERM. " +
			"For background daemon mode, use `install` + `start` (TODO).",
		RunE: runRun,
	}
}

func runRun(cmd *cobra.Command, _ []string) error {
	ctx, stop := signal.NotifyContext(cmd.Context(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	return hostservice.Run(ctx, rootFlags.Home, true)
}
