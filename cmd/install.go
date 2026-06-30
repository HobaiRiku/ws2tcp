package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/privilege"
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
			if err := privilege.EnsurePrivilege(scope, os.Args[1:]); err != nil {
				return err
			}
			if err := serviceInstall(rootFlags.Home, scope); err != nil {
				return fmt.Errorf("install service: %w", err)
			}
			_, _ = fmt.Fprintln(cmd.OutOrStdout(), "service installed")
			return nil
		},
	}
}
