package cmd

import (
	"fmt"
	"os"

	kservice "github.com/kardianos/service"
	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	hostservice "websocket2Tcp/internal/service"
)

var serviceStatus = hostservice.Status

func statusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Show ws2tcp service status",
		RunE: func(cmd *cobra.Command, _ []string) error {
			scope := rootScope()
			if err := ensurePrivilege(scope, os.Args[1:]); err != nil {
				return err
			}
			p, err := paths.ResolveScope(rootFlags.Home, scope)
			if err != nil {
				return err
			}
			status, err := serviceStatus(p.Home, scope)
			if err != nil {
				return fmt.Errorf("get service status scope=%s home=%s: %w", scope, p.Home, err)
			}
			_, _ = fmt.Fprintf(cmd.OutOrStdout(),
				"scope:  %s\nhome:   %s\nconfig: %s\nlog:    %s\nstatus: %s\n",
				scope, p.Home, p.Config(), p.LogFile(), statusString(status),
			)
			return nil
		},
	}
}

func statusString(status kservice.Status) string {
	return hostservice.StatusString(status)
}
