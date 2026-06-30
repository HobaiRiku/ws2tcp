package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	hostservice "websocket2Tcp/internal/service"
)

var serviceStop = hostservice.Stop

func stopCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "stop",
		Short: "Stop the installed ws2tcp service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			scope := rootScope()
			p, err := paths.ResolveScope(rootFlags.Home, scope)
			if err != nil {
				return err
			}
			if err := serviceStop(p.Home, scope); err != nil {
				return fmt.Errorf("stop service scope=%s home=%s: %w", scope, p.Home, err)
			}
			_, _ = fmt.Fprintf(cmd.OutOrStdout(), "service stopped scope=%s home=%s\n", scope, p.Home)
			return nil
		},
	}
}
