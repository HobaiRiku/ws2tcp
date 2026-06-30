package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/privilege"
	hostservice "websocket2Tcp/internal/service"
)

var serviceUninstall = hostservice.Uninstall

func uninstallCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "uninstall",
		Short: "Uninstall the ws2tcp OS service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			scope := rootScope()
			if err := privilege.EnsurePrivilege(scope, os.Args[1:]); err != nil {
				return err
			}
			if err := serviceUninstall(rootFlags.Home, scope); err != nil {
				return fmt.Errorf("uninstall service: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "service uninstalled")
			return nil
		},
	}
}
