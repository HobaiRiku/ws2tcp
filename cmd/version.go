package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"websocket2Tcp/internal/version"
)

func versionCmd() *cobra.Command {
	return &cobra.Command{
		Use:     "version",
		Aliases: []string{"v"},
		Short:   "Print version info",
		Run: func(_ *cobra.Command, _ []string) {
			fmt.Println(version.String())
		},
	}
}
