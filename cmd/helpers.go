package cmd

import (
	"fmt"
	"strings"

	"github.com/jedib0t/go-pretty/v6/table"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v3"

	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
)

func loadConfigAndRegistry() (*config.Config, *services.Registry, error) {
	p, err := paths.ResolveScope(rootFlags.Home, rootScope())
	if err != nil {
		return nil, nil, err
	}
	cfg, err := config.Load(p.Config())
	if err != nil {
		return nil, nil, fmt.Errorf("load config: %w", err)
	}
	reg, err := services.NewWithPaths(cfg, p)
	if err != nil {
		return nil, nil, fmt.Errorf("build registry: %w", err)
	}
	return cfg, reg, nil
}

func loadRegistry() (*services.Registry, error) {
	_, reg, err := loadConfigAndRegistry()
	return reg, err
}

func loadConfig() (*config.Config, error) {
	cfg, _, err := loadConfigAndRegistry()
	return cfg, err
}

func printYAML(cmd *cobra.Command, v any) error {
	out, err := yaml.Marshal(v)
	if err != nil {
		return fmt.Errorf("marshal yaml: %w", err)
	}
	_, _ = fmt.Fprint(cmd.OutOrStdout(), string(out))
	return nil
}

func newTable(cmd *cobra.Command) table.Writer {
	tw := table.NewWriter()
	tw.SetOutputMirror(cmd.OutOrStdout())
	style := table.StyleLight
	style.Options = table.OptionsNoBordersAndSeparators
	tw.SetStyle(style)
	return tw
}

func requireChangedFlags(cmd *cobra.Command, names ...string) error {
	for _, name := range names {
		if cmd.Flags().Changed(name) {
			return nil
		}
	}
	return fmt.Errorf("no fields provided")
}

func tableString(value string) string {
	if strings.TrimSpace(value) == "" {
		return "-"
	}
	return value
}
