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
	scope := rootScope()
	// Resolve the home directory so we can acquire the PID lock before
	// app.Run spins up any goroutines. Use the scope-derived default if
	// neither --home nor WS2TCP_HOME is set.
	p, err := paths.ResolveScope(rootFlags.Home, scope)
	if err != nil {
		return err
	}
	_, _ = fmt.Fprintf(cmd.ErrOrStderr(), "scope=%s home=%s\n", scope, p.Home)

	pidFile := p.PIDFile()
	if err := pid.Acquire(pidFile); err != nil {
		return err
	}
	defer pid.Release(pidFile)

	ctx, stop := signal.NotifyContext(cmd.Context(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	// Pass the already-resolved path so service.Run uses the same home directory
	// as the PID lock, regardless of whether --home was set explicitly.
	return hostservice.Run(ctx, p.Home, true)
}
