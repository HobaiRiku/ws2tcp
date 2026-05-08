````md
# Go CLI Service Starter Architecture

## Project Goals

Build a cross-platform Golang CLI + daemon service framework with the following capabilities:

- Modern CLI command and argument management
- Cross-platform background service install / uninstall / start / stop
- Built-in HTTP server for API and Web UI
- Frontend static assets embedded into the binary
- Cross-platform config and data directory management
- Single-binary distribution and release workflow

Suitable for:

- Self-hosted tools
- Intranet tunneling clients
- NAS management tools
- Small agents
- Local service-style applications

---

# Technology Choices

## CLI

### Cobra

Used to build the command tree and argument management.

Capabilities:

- Subcommands
- Flags
- Help
- Shell completion

Example:

```bash
myapp run
myapp install
myapp start
myapp stop
myapp version
````

Dependency:

```bash
github.com/spf13/cobra
```

---

## Configuration Management

### Viper

Used to read:

* yaml
* json
* env

Capabilities:

* Optional hot reload
* Multiple configuration sources

Dependency:

```bash
github.com/spf13/viper
```

---

## Background Service Registration

### kardianos/service

Provides a unified layer for:

* Linux systemd
* macOS launchd
* Windows Service

Commands:

```bash
myapp install
myapp uninstall
myapp start
myapp stop
```

Dependency:

```bash
github.com/kardianos/service
```

---

## HTTP Server

### Chi

A lightweight HTTP router.

Capabilities:

* middleware
* route grouping
* REST API

Dependency:

```bash
github.com/go-chi/chi/v5
```

Examples:

* /health
* /api/*
* web static

---

## Web Static Embed

### Go embed

Embeds frontend build artifacts into the binary.

Approach:

Build artifacts are produced from `ui/`, then copied into `internal/web/static/`, and embedded into the binary.

Capabilities:

* Single-file deployment
* No dependency on an external static directory
* Works well with a PWA Service Worker

Suitable for:

* React
* Vue
* Svelte
* Vite

Additional constraints:

* Production build output should consistently go to `internal/web/static/`
* Development mode should not enable the Service Worker, to avoid interfering with HMR
* Release builds can integrate `vite-plugin-pwa` on the frontend side to generate `sw.js` and a precache manifest
* The backend is only responsible for serving static assets and the `index.html` fallback, not for implementing static update detection logic in Go

---

## Config and Data Directories

### xdg

Used to manage cross-platform directories consistently:

Linux:

* ~/.config/myapp
* ~/.local/share/myapp

macOS:

* ~/Library/Application Support/myapp

Windows:

* AppData

Dependency:

```bash
github.com/adrg/xdg
```

Directory responsibilities:

## config

Stores:

* config.yaml
* secrets

## data

Stores:

* sqlite
* logs
* runtime files

---

## Logging

Recommended:

### slog (standard library)

Capabilities:

* structured logging
* json/text output

Log directory:

```bash
data/logs/
```

---

## Local Database (Optional)

Recommended:

### sqlite

Suitable for:

* metadata
* jobs
* cache
* local state

Recommended:

```bash
modernc.org/sqlite
```

Pure Go, no CGO.

---

# Build System

## Makefile

Unifies local development and build tasks.

Common commands:

```bash
make run
make build
make clean
make test
make release
```

Responsibilities:

* build frontend
* go build
* inject version
* release

---

## Goreleaser

Used for cross-platform releases.

Targets:

* linux
* darwin
* windows

Architectures:

* amd64
* arm64

Artifacts:

```bash
dist/
```

Capabilities:

* archive
* checksum
* release packaging

---

# Project Structure

```bash
myapp/
├── main.go
├── Makefile
├── .goreleaser.yaml
│
├── cmd/
│   ├── root.go
│   ├── run.go
│   ├── install.go
│   ├── uninstall.go
│   ├── start.go
│   ├── stop.go
│   └── version.go
│
├── internal/
│   ├── app/
│   ├── config/
│   ├── service/
│   ├── server/
│   ├── web/
│   ├── storage/
│   └── log/
│
└── ui/
    ├── src/
    └── dist/
```

---

# Core Startup Flow

```text
main
  └─ cobra execute
      └─ command
          └─ app.Run()
              ├─ init paths
              ├─ load config
              ├─ init logger
              ├─ init storage
              ├─ start http server
              └─ wait signal
```

---

# CLI Lifecycle

## Development Mode

```bash
myapp run
```

Runs in the foreground.

Use cases:

* local debugging
* development

---

## Install Service

```bash
myapp install
```

Registers the system service.

---

## Start Service

```bash
myapp start
```

Runs in the background.

---

## Stop Service

```bash
myapp stop
```

Stops the background service.

---

## Uninstall Service

```bash
myapp uninstall
```

Removes the system service registration.

---

# HTTP Service Responsibilities

Provides:

## API

```bash
/api/*
```

Examples:

* health
* config
* status
* business logic

---

## Web UI

Static resources:

```bash
/
```

Served from the embedded filesystem.

Recommended layering:

* `ui/` handles the SPA, routing, PWA registration, and static update strategy
* `internal/web/` handles embedding, static file serving, and the `/` fallback
* `/api/*` should always be treated as an online data source and must not be cached by the Service Worker

### PWA Design

If the Web UI needs to be installable as a desktop-style application, it is recommended to integrate the PWA at the frontend build layer instead of pushing caching and upgrade logic into the Go service.

Recommended approach:

* Use `vite-plugin-pwa`
* Set `registerType = autoUpdate`
* Set `injectRegister = false`, and register it explicitly at runtime
* Use Workbox to precache frontend shell assets (`index.html`, `assets/*`, manifest, icons)
* Configure `/api/*` as `NetworkOnly`

Why:

* PWA updates are versioned around static assets, not backend process versions
* Update detection, new Service Worker activation, and page reload all happen in the browser
* The Go service only needs to serve the latest static assets and does not need to understand the lifecycle of old browser caches

### PWA Static Update Strategy

For an admin console that should automatically reload when new static assets are available, the following strategy is recommended:

1. Register the Service Worker after the router is ready
2. Run `registration.update()` immediately after the first successful registration
3. Trigger another update check when the page becomes visible again
4. Also run `registration.update()` periodically on a timer
5. Automatically reload the page when the new Service Worker takes control (`controllerchange`)

Recommended constraints:

* Keep polling intervals at the minute level to avoid unnecessary request storms
* Do not trigger an extra reload on the very first PWA installation just because the first controller appears
* Automatic reload should only be used for static shell updates; if the user may be in the middle of a form submission, prompt mode may be safer

### Reference Implementation Boundaries

Frontend runtime responsibilities:

* Register `virtual:pwa-register`
* Listen to `controllerchange`
* Listen to `visibilitychange`
* Periodically call `registration.update()`
* Call `updateSW(true)` when a new version is found, or reload after the new controller becomes active

Build-layer responsibilities:

* Generate `manifest.webmanifest`
* Generate `sw.js`
* Only place cacheable static resources into precache

Backend responsibilities:

* Serve the latest static artifacts
* Return `index.html` for SPA routes
* Preserve normal HTTP / WebSocket semantics for `/api/*` and do not involve them in PWA caching

This keeps responsibilities clear: the browser controls PWA updates, and the Go service only supplies the artifacts.

---

# Version Injection

Injected at build time:

* version
* commit
* buildTime

Command:

```bash
myapp version
```

Output:

```bash
version: 1.0.0
commit: abc123
built: 2026-05-03T00:00:00Z
```

---

# Future Extensibility

Can be extended with:

* websocket
* auth token
* plugin system
* auto update
* PWA offline shell
* PWA static asset auto refresh
* task scheduler
* metrics
* pprof

---

# Recommended Final Stack

* cobra
* viper
* kardianos/service
* chi
* embed
* vite-plugin-pwa / workbox
* xdg
* sqlite
* slog
* make
* goreleaser

---

# Design Principles

1. Single-binary deployment
2. Consistent cross-platform behavior
3. CLI-first
4. Web UI as an additional capability
5. Separation of config and data
6. Minimal external dependencies

```
```
