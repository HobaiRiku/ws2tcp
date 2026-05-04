package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	hostservice "websocket2Tcp/internal/service"
)

var serviceUninstall = hostservice.Uninstall

func uninstallCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "uninstall",
		Short: "Uninstall the ws2tcp OS service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if err := serviceUninstall(rootFlags.Home); err != nil {
				return fmt.Errorf("uninstall service: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "service uninstalled")
			return nil
		},
	}
}
