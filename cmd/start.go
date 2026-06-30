package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	hostservice "websocket2Tcp/internal/service"
)

var serviceStart = hostservice.Start

func startCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "start",
		Short: "Start the installed ws2tcp service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			if err := serviceStart(rootFlags.Home, rootScope()); err != nil {
				return fmt.Errorf("start service: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "service started")
			return nil
		},
	}
}
