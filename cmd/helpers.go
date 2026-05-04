package cmd

import (
	"fmt"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
)

func loadRegistry() (*services.Registry, error) {
	p, err := paths.Resolve(rootFlags.Home)
	if err != nil {
		return nil, err
	}
	cfg, err := config.Load(p.Config())
	if err != nil {
		return nil, fmt.Errorf("load config: %w", err)
	}
	reg, err := services.NewWithPaths(cfg, p)
	if err != nil {
		return nil, fmt.Errorf("build registry: %w", err)
	}
	return reg, nil
}
