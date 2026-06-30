package cmd

import (
	"fmt"

	kservice "github.com/kardianos/service"
	"github.com/spf13/cobra"

	hostservice "websocket2Tcp/internal/service"
)

var serviceStatus = hostservice.Status

func statusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Show ws2tcp service status",
		RunE: func(cmd *cobra.Command, _ []string) error {
			status, err := serviceStatus(rootFlags.Home, rootScope())
			if err != nil {
				return fmt.Errorf("get service status: %w", err)
			}
			_, _ = fmt.Fprintf(cmd.OutOrStdout(), "%s\n", statusString(status))
			return nil
		},
	}
}

func statusString(status kservice.Status) string {
	return hostservice.StatusString(status)
}
