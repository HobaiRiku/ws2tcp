````md
# Go CLI Service Starter Architecture

## 项目目标

构建一个基于 Golang 的跨平台 CLI + Daemon 服务框架，具备以下能力：

- 现代化 CLI 参数与命令管理
- 跨平台后台服务注册/卸载/启动/停止
- 内置 HTTP Server，提供 API 与 Web UI
- 前端静态资源嵌入二进制文件
- 跨平台配置与数据目录管理
- 单二进制分发与构建发布体系

适用于：

- 自托管工具
- 内网穿透客户端
- NAS 管理工具
- 小型 Agent
- 本地服务型应用

---

# 技术选型

## CLI

### Cobra

用于构建命令结构与参数管理。

能力：

- 子命令
- flags
- help
- shell completion

示例：

```bash
myapp run
myapp install
myapp start
myapp stop
myapp version
````

依赖：

```bash
github.com/spf13/cobra
```

---

## 配置管理

### Viper

用于读取：

* yaml
* json
* env

能力：

* 配置热加载（可选）
* 多来源配置

依赖：

```bash
github.com/spf13/viper
```

---

## 后台服务注册

### kardianos/service

统一管理：

* Linux systemd
* macOS launchd
* Windows Service

命令：

```bash
myapp install
myapp uninstall
myapp start
myapp stop
```

依赖：

```bash
github.com/kardianos/service
```

---

## HTTP Server

### Chi

轻量级 HTTP Router。

能力：

* middleware
* route grouping
* REST API

依赖：

```bash
github.com/go-chi/chi/v5
```

示例：

* /health
* /api/*
* web static

---

## Web Static Embed

### Go embed

将前端打包产物嵌入二进制。

方式：

```go
//go:embed all:web/dist
```

能力：

* 单文件部署
* 无外部静态目录依赖

适合：

* React
* Vue
* Svelte
* Vite

---

## 配置与数据目录

### xdg

统一管理跨平台目录：

Linux:

* ~/.config/myapp
* ~/.local/share/myapp

macOS:

* ~/Library/Application Support/myapp

Windows:

* AppData

依赖：

```bash
github.com/adrg/xdg
```

目录职责：

## config

保存：

* config.yaml
* secrets

## data

保存：

* sqlite
* logs
* runtime files

---

## 日志

推荐：

### slog（标准库）

能力：

* structured logging
* json/text output

日志目录：

```bash
data/logs/
```

---

## 本地数据库（可选）

推荐：

### sqlite

适合：

* metadata
* jobs
* cache
* local state

推荐：

```bash
modernc.org/sqlite
```

纯 Go，无 CGO。

---

# 构建系统

## Makefile

统一本地开发与构建。

常用命令：

```bash
make run
make build
make clean
make test
make release
```

职责：

* build frontend
* go build
* inject version
* release

---

## Goreleaser

用于跨平台发布。

生成：

* linux
* darwin
* windows

架构：

* amd64
* arm64

产物：

```bash
dist/
```

能力：

* archive
* checksum
* release packaging

---

# 项目结构

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
└── web/
    ├── src/
    └── dist/
```

---

# 核心启动流程

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

# CLI 生命周期

## 开发模式

```bash
myapp run
```

前台运行。

用途：

* 本地调试
* 开发

---

## 安装服务

```bash
myapp install
```

注册系统服务。

---

## 启动服务

```bash
myapp start
```

后台运行。

---

## 停止服务

```bash
myapp stop
```

停止后台服务。

---

## 卸载服务

```bash
myapp uninstall
```

移除系统注册。

---

# HTTP 服务职责

提供：

## API

```bash
/api/*
```

例如：

* health
* config
* status
* business logic

---

## Web UI

静态资源：

```bash
/
```

来自 embed filesystem。

---

# 版本注入

构建时注入：

* version
* commit
* buildTime

命令：

```bash
myapp version
```

输出：

```bash
version: 1.0.0
commit: abc123
built: 2026-05-03T00:00:00Z
```

---

# 后续可扩展能力

可扩展：

* websocket
* auth token
* plugin system
* auto update
* task scheduler
* metrics
* pprof

---

# 推荐最终技术栈

* cobra
* viper
* kardianos/service
* chi
* embed
* xdg
* sqlite
* slog
* make
* goreleaser

---

# 设计原则

1. 单二进制部署
2. 跨平台一致行为
3. CLI 优先
4. Web UI 为附加能力
5. 配置与数据隔离
6. 最小外部依赖

```
```

