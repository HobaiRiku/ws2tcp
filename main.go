package main

import (
	"fmt"
	"os"
)

// Entry point. Real wiring lives in cmd/ (cobra root) and internal/app.
// Kept minimal during the scaffolding phase so the tree compiles before
// dependencies (cobra/viper/gin/...) are introduced.
func main() {
	fmt.Fprintln(os.Stderr, "ws2tcp: scaffolding only — see docs/design/00-overview.md")
	os.Exit(0)
}
