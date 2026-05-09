// Package version is the single source of truth for build metadata.
// Values are overridden at link time via -ldflags "-X websocket2Tcp/internal/version.Version=...".
package version

import (
	"runtime"
	"strings"
)

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

func shortCommit() string {
	if len(Commit) > 7 {
		return Commit[:7]
	}
	return Commit
}

func shortDate() string {
	// BuildDate is RFC3339, e.g. "2026-05-09T08:03:00Z" → "20260509T080300".
	s := strings.NewReplacer("-", "", ":", "", "Z", "").Replace(BuildDate)
	if idx := strings.IndexByte(s, 'T'); idx > 0 {
		return s[:idx] + s[idx+1:]
	}
	return s
}

func Current() Info {
	return Info{
		Version:   Version,
		Commit:    shortCommit(),
		BuildDate: shortDate(),
		GoVersion: runtime.Version(),
	}
}

func String() string {
	return "ws2tcp " + Version + " (" + shortCommit() + ", " + shortDate() + ")"
}
