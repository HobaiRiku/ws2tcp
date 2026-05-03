package service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"sync"

	kservice "github.com/kardianos/service"

	"websocket2Tcp/internal/app"
	"websocket2Tcp/internal/config"
	"websocket2Tcp/internal/log"
	"websocket2Tcp/internal/paths"
)

const (
	serviceName        = "ws2tcp"
	serviceDisplayName = "ws2tcp"
	serviceDescription = "WebSocket-to-TCP tunnel daemon"
)

// Program implements kardianos/service.Interface and delegates the real work
// to app.Run after loading the configured WS2TCP_HOME tree.
type Program struct {
	home string

	run func(context.Context, string, bool) error

	mu     sync.Mutex
	cancel context.CancelFunc
	done   chan struct{}
	runErr error
}

// NewProgram builds the service-host program. home follows the same semantics
// as --home / WS2TCP_HOME; the resolved absolute path is pinned into the
// installed service's environment by New().
func NewProgram(home string) *Program {
	return &Program{
		home: home,
		run:  Run,
	}
}

// New constructs a kardianos service wrapper around Program.
func New(home string) (kservice.Service, *Program, error) {
	p, resolved, err := newProgram(home)
	if err != nil {
		return nil, nil, err
	}
	svc, err := kservice.New(p, &kservice.Config{
		Name:             serviceName,
		DisplayName:      serviceDisplayName,
		Description:      serviceDescription,
		WorkingDirectory: resolved.Home,
		EnvVars: map[string]string{
			"WS2TCP_HOME": resolved.Home,
		},
	})
	if err != nil {
		return nil, nil, err
	}
	return svc, p, nil
}

func newProgram(home string) (*Program, paths.Paths, error) {
	resolved, err := paths.Resolve(home)
	if err != nil {
		return nil, paths.Paths{}, err
	}
	return NewProgram(resolved.Home), resolved, nil
}

// Interactive reports whether the current process is attached to a user
// session rather than launched by the OS service manager.
func Interactive() bool {
	return kservice.Interactive()
}

// RunService enters kardianos/service managed mode. main() should call this
// when Interactive() is false.
func RunService(home string) error {
	svc, _, err := New(home)
	if err != nil {
		return err
	}
	return svc.Run()
}

// Install registers the service with the OS service manager.
func Install(home string) error {
	svc, _, err := New(home)
	if err != nil {
		return err
	}
	return svc.Install()
}

// Uninstall removes the service registration from the OS service manager.
func Uninstall(home string) error {
	svc, _, err := New(home)
	if err != nil {
		return err
	}
	return svc.Uninstall()
}

// Start requests the OS service manager to start the registered service.
func Start(home string) error {
	svc, _, err := New(home)
	if err != nil {
		return err
	}
	return svc.Start()
}

// Stop requests the OS service manager to stop the registered service.
func Stop(home string) error {
	svc, _, err := New(home)
	if err != nil {
		return err
	}
	return svc.Stop()
}

// Status returns the current OS-managed service status.
func Status(home string) (kservice.Status, error) {
	svc, _, err := New(home)
	if err != nil {
		return kservice.StatusUnknown, err
	}
	return svc.Status()
}

// StatusString formats the kardianos status enum for CLI output.
func StatusString(status kservice.Status) string {
	switch status {
	case kservice.StatusRunning:
		return "running"
	case kservice.StatusStopped:
		return "stopped"
	default:
		return "unknown"
	}
}

// Run bootstraps paths/config/logging and then blocks in app.Run.
// console controls whether logs are mirrored to stderr.
func Run(ctx context.Context, home string, console bool) error {
	opts, closer, err := loadOptions(home, console)
	if err != nil {
		return err
	}
	defer closer.Close()

	opts.Logger.Info("ws2tcp starting", "home", opts.Paths.Home, "config", opts.Paths.Config())
	return app.Run(ctx, opts)
}

func loadOptions(home string, console bool) (app.Options, io.Closer, error) {
	p, err := paths.Resolve(home)
	if err != nil {
		return app.Options{}, nil, err
	}
	if err := p.EnsureTree(); err != nil {
		return app.Options{}, nil, fmt.Errorf("prepare home %s: %w", p.Home, err)
	}

	cfg, err := config.Load(p.Config())
	if err != nil {
		var miss *config.MissingFileError
		if errors.As(err, &miss) {
			return app.Options{}, nil, fmt.Errorf("config not found at %s — copy config.example.yaml to start", miss.Path)
		}
		return app.Options{}, nil, err
	}

	logger, closer, err := log.Init(log.Options{
		Level:   cfg.App.LogLevel,
		File:    p.LogFile(),
		Console: console,
	})
	if err != nil {
		return app.Options{}, nil, fmt.Errorf("log init: %w", err)
	}

	return app.Options{
		Paths:  p,
		Config: cfg,
		Logger: logger,
	}, closer, nil
}

// Start launches the daemon asynchronously as required by kardianos/service.
func (p *Program) Start(_ kservice.Service) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	if p.cancel != nil {
		return errors.New("service already started")
	}

	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	p.cancel = cancel
	p.done = done
	p.runErr = nil

	go func() {
		err := p.run(ctx, p.home, false)
		if err != nil && !errors.Is(err, context.Canceled) {
			p.logger().Error("service exited", "err", err, "home", p.home)
		}

		p.mu.Lock()
		defer p.mu.Unlock()
		p.runErr = err
		p.cancel = nil
		close(done)
	}()

	return nil
}

// Stop cancels the root context and waits for app.Run to drain.
func (p *Program) Stop(_ kservice.Service) error {
	p.mu.Lock()
	cancel := p.cancel
	done := p.done
	p.mu.Unlock()

	if cancel == nil {
		return nil
	}
	cancel()
	if done != nil {
		<-done
	}

	p.mu.Lock()
	defer p.mu.Unlock()
	return p.runErr
}

func (p *Program) logger() *slog.Logger {
	return slog.Default().With("component", "service")
}
