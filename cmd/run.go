package cmd

import (
	"errors"
	"fmt"
	"os/signal"
	"syscall"

	"github.com/spf13/cobra"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/app"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/config"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/log"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/paths"
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
	p, err := paths.Resolve(rootFlags.Home)
	if err != nil {
		return err
	}
	if err := p.EnsureTree(); err != nil {
		return fmt.Errorf("prepare home %s: %w", p.Home, err)
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		var miss *config.MissingFileError
		if errors.As(err, &miss) {
			return fmt.Errorf("config not found at %s — copy config.example.yaml to start", miss.Path)
		}
		return err
	}

	logger, closer, err := log.Init(log.Options{
		Level:   cfg.App.LogLevel,
		File:    p.LogFile(),
		Console: true,
	})
	if err != nil {
		return fmt.Errorf("log init: %w", err)
	}
	defer closer.Close()

	ctx, stop := signal.NotifyContext(cmd.Context(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	logger.Info("ws2tcp starting", "home", p.Home, "config", p.Config())
	return app.Run(ctx, app.Options{Paths: p, Config: cfg, Logger: logger})
}
