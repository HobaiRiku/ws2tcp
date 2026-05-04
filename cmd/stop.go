package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	hostservice "websocket2Tcp/internal/service"
)

var serviceStop = hostservice.Stop

func stopCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "stop",
		Short: "Stop the installed ws2tcp service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if err := serviceStop(rootFlags.Home); err != nil {
				return fmt.Errorf("stop service: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "service stopped")
			return nil
		},
	}
}
