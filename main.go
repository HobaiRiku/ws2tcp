package main

import (
	"fmt"
	"os"

	"websocket2Tcp/cmd"
	hostservice "websocket2Tcp/internal/service"
)

func main() {
	if !hostservice.Interactive() {
		if err := hostservice.RunService(""); err != nil {
			fmt.Fprintln(os.Stderr, "error:", err)
			os.Exit(1)
		}
		return
	}
	if err := cmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}
