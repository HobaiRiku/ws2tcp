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
	applog "websocket2Tcp/internal/log"
	"websocket2Tcp/internal/paths"
	"websocket2Tcp/internal/services"
	"websocket2Tcp/internal/services/events"
	"websocket2Tcp/internal/version"
	"websocket2Tcp/internal/web"
)

// Options bundles the inputs Run needs. Built by cmd/ from CLI flags.
type Options struct {
	Paths  paths.Paths
	Config *config.Config
	Logger *slog.Logger
	LogTap *applog.Tap
}

// Run starts the configured subsystems and blocks until ctx is cancelled,
// after which it drains gracefully.
//
// Subsystems:
//   - server: http(s) listener + upgrade handler
//   - client: N-tunnel manager
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

	if opts.LogTap != nil {
		opts.LogTap.SetPublisher(func(rec applog.Record) {
			eventBus.Publish(events.Message{
				Topic: "log",
				Time:  rec.Time,
				Data: map[string]any{
					"level":   rec.Level,
					"message": rec.Message,
					"attrs":   rec.Attrs,
				},
			})
		})
	}

	info := version.Current()
	eventBus.Emit("app.started", map[string]any{
		"version":    info.Version,
		"commit":     info.Commit,
		"build_date": info.BuildDate,
	})
	opts.Logger.Info("app started", "version", info.Version, "commit", info.Commit)

	supervisor := newServerSupervisor(opts, registry, runtime, eventBus)

	var wg sync.WaitGroup
	errs := make(chan error, 4)

	if cfg.App.HTTPListen != "" {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if err := runAPI(ctx, opts, registry, runtime, eventBus, supervisor); err != nil && !errors.Is(err, http.ErrServerClosed) {
				errs <- fmt.Errorf("api: %w", err)
			}
		}()
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := supervisor.Run(ctx); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errs <- fmt.Errorf("server: %w", err)
		}
	}()

	if cfg.ClientConfigured() {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mgr := client.NewManager(registry, runtime, eventBus, opts.Logger)
			eventBus.Emit("client.manager.started", map[string]any{
				"profiles": len(cfg.Client.Clients),
			})
			mgr.Run(ctx)
		}()
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

func runAPI(ctx context.Context, opts Options, reg *services.Registry, rt *services.Runtime, bus *events.Bus, supervisor *serverSupervisor) error {
	auth := services.NewAuthService(reg.HTTPToken)
	router := api.NewRouter(api.Options{
		Registry:      reg,
		Runtime:       rt,
		Auth:          auth,
		Events:        bus,
		LogFile:       opts.Paths.LogFile(),
		LogTap:        opts.LogTap,
		RequireAuth:   opts.Config.App.HTTPAuth,
		Logger:        opts.Logger.With("component", "api"),
		ServerControl: supervisor,
	})
	web.Mount(router)

	srv := &http.Server{
		Addr:              opts.Config.App.HTTPListen,
		Handler:           router,
		ReadHeaderTimeout: 15 * time.Second,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		_ = srv.Shutdown(shutdownCtx)
	}()

	opts.Logger.Info("management api listening", "addr", opts.Config.App.HTTPListen)
	bus.Emit("api.listening", map[string]any{
		"addr": opts.Config.App.HTTPListen,
	})
	return srv.ListenAndServe()
}

// serverSupervisor runs the ws2tcp-server subsystem in a loop so that
// transport-affecting config edits (listen / ws_path / aes_key / tls / ...)
// can take effect without restarting the whole process. The management API
// triggers a restart by calling Restart(), which cancels the current server
// listener and lets the loop spin up a fresh one with the latest config.
type serverSupervisor struct {
	opts      Options
	reg       *services.Registry
	rt        *services.Runtime
	bus       *events.Bus
	restartCh chan struct{}
}

func newServerSupervisor(opts Options, reg *services.Registry, rt *services.Runtime, bus *events.Bus) *serverSupervisor {
	return &serverSupervisor{opts: opts, reg: reg, rt: rt, bus: bus, restartCh: make(chan struct{}, 1)}
}

// Restart signals the supervisor to tear down the current server listener
// (if any) and restart with the latest on-disk config. Non-blocking: if a
// restart is already pending the call coalesces.
func (s *serverSupervisor) Restart() {
	select {
	case s.restartCh <- struct{}{}:
	default:
	}
}

// Run blocks until ctx is cancelled, restarting the underlying server
// each time Restart() fires.
func (s *serverSupervisor) Run(ctx context.Context) error {
	for {
		cfg, err := config.Load(s.opts.Paths.Config())
		if err != nil {
			s.opts.Logger.Error("supervisor: load config", "err", err)
			cfg = s.opts.Config
		}
		if !cfg.ShouldRunServer() {
			// 没填齐字段, 或者 server.enabled=false (用户显式关掉).
			// 都等待 restart / 关停信号, 不起 server.
			select {
			case <-ctx.Done():
				return nil
			case <-s.restartCh:
				continue
			}
		}

		serverCtx, cancel := context.WithCancel(ctx)
		done := make(chan error, 1)
		go func() {
			done <- runServer(serverCtx, s.opts, cfg.Server, s.reg, s.rt, s.bus)
		}()

		select {
		case <-ctx.Done():
			cancel()
			<-done
			return nil
		case <-s.restartCh:
			s.opts.Logger.Info("server: restart requested, reloading")
			cancel()
			<-done
			// loop back and reload from disk
		case err := <-done:
			cancel()
			if err != nil && !errors.Is(err, http.ErrServerClosed) {
				return err
			}
			// server exited cleanly with no restart pending; wait for either.
			select {
			case <-ctx.Done():
				return nil
			case <-s.restartCh:
			}
		}
	}
}

func runServer(ctx context.Context, opts Options, cfg config.ServerConfig, reg *services.Registry, rt *services.Runtime, bus *events.Bus) error {
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
		bus.Emit("server.listening", map[string]any{
			"addr":    cfg.Listen,
			"ws_path": cfg.WSPath,
			"tls":     true,
		})
		// Force a sane TLS config: disable old protocols, leave cert hot-load
		// to a future feature (operators can SIGHUP on cert rotation later).
		srv.TLSConfig = &tls.Config{MinVersion: tls.VersionTLS12}
		return srv.ListenAndServeTLS(certPath, keyPath)
	}
	opts.Logger.Info("server listening", "addr", cfg.Listen, "ws_path", cfg.WSPath)
	bus.Emit("server.listening", map[string]any{
		"addr":    cfg.Listen,
		"ws_path": cfg.WSPath,
		"tls":     false,
	})
	return srv.ListenAndServe()
}
