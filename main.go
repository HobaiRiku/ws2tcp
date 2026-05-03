package main

import (
	"fmt"
	"os"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}
