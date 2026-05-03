package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// Version metadata is overrideable at build time via -ldflags. Defaults
// shown when the binary was built without ldflag injection (e.g. `go run`).
var (
	Version   = "dev"
	Commit    = "unknown"
	BuildDate = "unknown"
)

func versionCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "version",
		Short: "Print version info",
		Run: func(_ *cobra.Command, _ []string) {
			fmt.Printf("ws2tcp %s (%s, built %s)\n", Version, Commit, BuildDate)
		},
	}
}
