package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	hostservice "websocket2Tcp/internal/service"
)

var serviceInstall = hostservice.Install

func installCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "install",
		Short: "Install the ws2tcp OS service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if err := serviceInstall(rootFlags.Home); err != nil {
				return fmt.Errorf("install service: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "service installed")
			return nil
		},
	}
}
