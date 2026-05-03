// Package log wires log/slog to a JSON file under WS2TCP_HOME/logs/ and an
// optional stderr text mirror for foreground runs. See
// docs/design/01-config-and-storage.md.
package log

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
)

// Options controls Init.
type Options struct {
	// Level is debug|info|warn|error (case-insensitive). Empty -> info.
	Level string
	// File is the absolute log file path (mode 0600). Empty -> file logging off.
	File string
	// Console mirrors records to stderr in text form. Always on when File is empty.
	Console bool
}

// Init builds an *slog.Logger and returns a Closer that owns the log file
// (so the caller can close it during shutdown).
func Init(opts Options) (*slog.Logger, io.Closer, error) {
	lvl := parseLevel(opts.Level)
	hopts := &slog.HandlerOptions{Level: lvl}

	var (
		handlers []slog.Handler
		closer   io.Closer = noopCloser{}
	)

	if opts.File != "" {
		if err := os.MkdirAll(filepath.Dir(opts.File), 0o700); err != nil {
			return nil, nil, fmt.Errorf("mkdir log dir: %w", err)
		}
		f, err := os.OpenFile(opts.File, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
		if err != nil {
			return nil, nil, fmt.Errorf("open %s: %w", opts.File, err)
		}
		handlers = append(handlers, slog.NewJSONHandler(f, hopts))
		closer = f
	}
	if opts.Console || opts.File == "" {
		handlers = append(handlers, slog.NewTextHandler(os.Stderr, hopts))
	}

	return slog.New(fanoutHandler(handlers)), closer, nil
}

func parseLevel(s string) slog.Level {
	switch strings.ToLower(strings.TrimSpace(s)) {
	case "debug":
		return slog.LevelDebug
	case "warn", "warning":
		return slog.LevelWarn
	case "error":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

type noopCloser struct{}

func (noopCloser) Close() error { return nil }

// fanout wraps multiple slog.Handlers; records go to all of them.
// Saves us from importing a third-party tee handler for what is one method.
type fanout []slog.Handler

func fanoutHandler(hs []slog.Handler) slog.Handler {
	if len(hs) == 1 {
		return hs[0]
	}
	return fanout(hs)
}

func (f fanout) Enabled(ctx context.Context, lvl slog.Level) bool {
	for _, h := range f {
		if h.Enabled(ctx, lvl) {
			return true
		}
	}
	return false
}

func (f fanout) Handle(ctx context.Context, r slog.Record) error {
	var firstErr error
	for _, h := range f {
		if err := h.Handle(ctx, r.Clone()); err != nil && firstErr == nil {
			firstErr = err
		}
	}
	return firstErr
}

func (f fanout) WithAttrs(attrs []slog.Attr) slog.Handler {
	out := make(fanout, len(f))
	for i, h := range f {
		out[i] = h.WithAttrs(attrs)
	}
	return out
}

func (f fanout) WithGroup(name string) slog.Handler {
	out := make(fanout, len(f))
	for i, h := range f {
		out[i] = h.WithGroup(name)
	}
	return out
}
