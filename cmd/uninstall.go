package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	hostservice "websocket2Tcp/internal/service"
)

var serviceUninstall = hostservice.Uninstall

func uninstallCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "uninstall",
		Short: "Uninstall the ws2tcp OS service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			scope := rootScope()
			if err := ensurePrivilege(scope, os.Args[1:]); err != nil {
				return err
			}
			p, err := paths.ResolveScope(rootFlags.Home, scope)
			if err != nil {
				return err
			}
			if err := serviceUninstall(p.Home, scope); err != nil {
				return fmt.Errorf("uninstall service scope=%s home=%s: %w", scope, p.Home, err)
			}
			_, _ = fmt.Fprintf(cmd.OutOrStdout(), "service uninstalled scope=%s home=%s\n", scope, p.Home)
			return nil
		},
	}
}
