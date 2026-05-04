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

	"websocket2Tcp/internal/api"
	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/core/client"
	"websocket2Tcp/internal/core/server"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
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
//   - api / web ui: management API is started on app.http_listen; web UI lands
//     in a later slice.
func Run(ctx context.Context, opts Options) error {
	if opts.Logger == nil {
		opts.Logger = slog.Default()
	}
	cfg := opts.Config

	registry, err := services.NewWithPaths(cfg, opts.Paths)
	if err != nil {
		return fmt.Errorf("services.New: %w", err)
	}
	runtime := services.NewRuntime()
	eventBus := events.NewBus()

	var wg sync.WaitGroup
	errs := make(chan error, 4)

	if cfg.App.HTTPListen != "" {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := runAPI(ctx, opts, registry, runtime, eventBus); err != nil && !errors.Is(err, http.ErrServerClosed) {
				errs <- fmt.Errorf("api: %w", err)
			}
		}()
	}

	if cfg.Server.Enabled {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := runServer(ctx, opts, registry, runtime, eventBus); err != nil && !errors.Is(err, http.ErrServerClosed) {
				errs <- fmt.Errorf("server: %w", err)
			}
		}()
	}

	if cfg.Client.Enabled {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mgr := client.NewManager(registry, runtime, eventBus, opts.Logger)
			mgr.Run(ctx)
		}()
	}

	if !cfg.Server.Enabled && !cfg.Client.Enabled && cfg.App.HTTPListen == "" {
		opts.Logger.Warn("server, client, and api are all disabled in config; nothing to do")
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

func runAPI(ctx context.Context, opts Options, reg *services.Registry, rt *services.Runtime, bus *events.Bus) error {
	auth := services.NewAuthService(opts.Paths.Tokens(), opts.Paths.FileMode())

	srv := &http.Server{
		Addr: opts.Config.App.HTTPListen,
		Handler: api.NewRouter(api.Options{
			Registry:    reg,
			Runtime:     rt,
			Auth:        auth,
			Events:      bus,
			RequireAuth: opts.Config.App.HTTPAuth,
			Logger:      opts.Logger.With("component", "api"),
		}),
		ReadHeaderTimeout: 15 * time.Second,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
	}()

	opts.Logger.Info("management api listening", "addr", opts.Config.App.HTTPListen)
	return srv.ListenAndServe()
}

func runServer(ctx context.Context, opts Options, reg *services.Registry, rt *services.Runtime, bus *events.Bus) error {
	cfg := opts.Config.Server
	handler := server.NewHandler(cfg, reg, rt, bus, opts.Logger.With("component", "server"))
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
