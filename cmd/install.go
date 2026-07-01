package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/paths"
	hostservice "websocket2Tcp/internal/service"
)

var serviceInstall = hostservice.Install

func installCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "install",
		Short: "Install the ws2tcp OS service",
		RunE: func(cmd *cobra.Command, _ []string) error {
			scope := rootScope()
			// System-scope install requires root; re-exec under sudo on Unix
			// or print an instructional error on Windows.
			if err := ensurePrivilege(scope, os.Args[1:]); err != nil {
				return err
			}
			p, err := paths.ResolveScope(rootFlags.Home, scope)
			if err != nil {
				return err
			}
			binPath, err := serviceInstall(p.Home, scope)
			if err != nil {
				return fmt.Errorf("install service scope=%s home=%s: %w", scope, p.Home, err)
			}
			_, _ = fmt.Fprintf(cmd.OutOrStdout(), "service installed scope=%s home=%s bin=%s\n", scope, p.Home, binPath)
			return nil
		},
	}
}
