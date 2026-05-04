// Package version is the single source of truth for build metadata.
// Values are overridden at link time via -ldflags "-X websocket2Tcp/internal/version.Version=...".
package version

import "runtime"

var (
	Version   = "dev"
	Commit    = "unknown"
	BuildDate = "unknown"
)

type Info struct {
	Version   string `json:"version"`
	Commit    string `json:"commit"`
	BuildDate string `json:"build_date"`
	GoVersion string `json:"go_version"`
}

func Current() Info {
	return Info{
		Version:   Version,
		Commit:    Commit,
		BuildDate: BuildDate,
		GoVersion: runtime.Version(),
	}
}

func String() string {
	return "ws2tcp " + Version + " (" + Commit + ", built " + BuildDate + ", " + runtime.Version() + ")"
}
