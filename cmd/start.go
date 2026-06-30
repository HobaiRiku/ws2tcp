package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	hostservice "websocket2Tcp/internal/service"
)

var serviceStart = hostservice.Start

func startCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "start",
		Short: "Start the installed ws2tcp service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			scope := rootScope()
			p, err := paths.ResolveScope(rootFlags.Home, scope)
			if err != nil {
				return err
			}
			if err := serviceStart(p.Home, scope); err != nil {
				return fmt.Errorf("start service scope=%s home=%s: %w", scope, p.Home, err)
			}
			_, _ = fmt.Fprintf(cmd.OutOrStdout(), "service started scope=%s home=%s\n", scope, p.Home)
			return nil
		},
	}
}
