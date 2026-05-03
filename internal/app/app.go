// Package app is the composition root: it wires paths -> config -> log ->
// services -> server/client subsystems behind a single Run(ctx) call. The
// CLI's `run` command (and later the kardianos/service Start hook) invoke
// this; nothing here knows about cobra or HTTP frameworks.
package app

import (
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/config"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/core/client"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/core/server"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/paths"
	"gitlab.hobairiku.site/hobairiku/websocket2Tcp/internal/services"
)

// Options bundles the inputs Run needs. Built by cmd/ from CLI flags.
type Options struct {
	Paths  paths.Paths
	Config *config.Config
	Logger *slog.Logger
}

// Run starts every enabled subsystem and blocks until ctx is cancelled,
// after which it drains gracefully.
//
// Subsystems:
//   - server (cfg.Server.Enabled): http(s) listener + upgrade handler
//   - client (cfg.Client.Enabled): N-tunnel manager
//   - api / web ui: TODO (separate package, lands with internal/api)
func Run(ctx context.Context, opts Options) error {
	if opts.Logger == nil {
		opts.Logger = slog.Default()
	}
	cfg := opts.Config

	registry, err := services.New(cfg)
	if err != nil {
		return fmt.Errorf("services.New: %w", err)
	}
	runtime := services.NewRuntime()

	var wg sync.WaitGroup
	errs := make(chan error, 3)

	if cfg.Server.Enabled {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := runServer(ctx, opts, registry, runtime); err != nil && !errors.Is(err, http.ErrServerClosed) {
				errs <- fmt.Errorf("server: %w", err)
			}
		}()
	}

	if cfg.Client.Enabled {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mgr := client.NewManager(registry, runtime, opts.Logger)
			mgr.Run(ctx)
		}()
	}

	if !cfg.Server.Enabled && !cfg.Client.Enabled {
		opts.Logger.Warn("both server and client disabled in config; nothing to do")
	}

	wg.Wait()
	close(errs)

	var firstErr error
	for e := range errs {
		opts.Logger.Error("subsystem failure", "err", e)
		if firstErr == nil {
			firstErr = e
		}
	}
	return firstErr
}

func runServer(ctx context.Context, opts Options, reg *services.Registry, rt *services.Runtime) error {
	cfg := opts.Config.Server
	handler := server.NewHandler(cfg, reg, rt, opts.Logger.With("component", "server"))
	defer handler.Close()

	mux := http.NewServeMux()
	mux.Handle(cfg.WSPath, handler)

	srv := &http.Server{
		Addr:              cfg.Listen,
		Handler:           mux,
		ReadHeaderTimeout: 15 * time.Second,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
	}()

	if cfg.TLS.Enabled {
		certPath := opts.Paths.ResolveRelative(cfg.TLS.Cert)
		keyPath := opts.Paths.ResolveRelative(cfg.TLS.Key)
		opts.Logger.Info("server listening (tls)", "addr", cfg.Listen, "ws_path", cfg.WSPath)
		// Force a sane TLS config: disable old protocols, leave cert hot-load
		// to a future feature (operators can SIGHUP on cert rotation later).
		srv.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
		return srv.ListenAndServeTLS(certPath, keyPath)
	}
	opts.Logger.Info("server listening", "addr", cfg.Listen, "ws_path", cfg.WSPath)
	return srv.ListenAndServe()
}
