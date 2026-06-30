package cmd

import (
	"fmt"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/pid"
	hostservice "websocket2Tcp/internal/service"
)

func runCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "run",
		Short: "Run ws2tcp in the foreground",
		Long: "Loads ~/.ws2tcp/config.yaml (or $WS2TCP_HOME), starts every enabled " +
			"subsystem (server, client tunnels), and blocks until SIGINT/SIGTERM. " +
			"For background daemon mode, use `install` + `start`.",
		RunE: runRun,
	}
}

func runRun(cmd *cobra.Command, _ []string) error {
	// Resolve the home directory so we can acquire the PID lock before
	// app.Run spins up any goroutines. Use the scope-derived default if
	// neither --home nor WS2TCP_HOME is set.
	p, err := paths.ResolveScope(rootFlags.Home, rootScope())
	if err != nil {
		return err
	}

	pidFile := p.PIDFile()
	if err := pid.Acquire(pidFile); err != nil {
		return fmt.Errorf("%w", err)
	}
	defer pid.Release(pidFile)

	ctx, stop := signal.NotifyContext(cmd.Context(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	return hostservice.Run(ctx, rootFlags.Home, true)
}
