# ws2tcp — top-level Makefile
#
# Build pipeline:
#   make ui-install    # 一次性: 装前端依赖 (pnpm)
#   make ui-build      # 构建 SPA 到 internal/web/static/
#   make build         # 构建 Go 二进制 (会先跑 ui-build)
#   make run / dev     # 本地起服务 (会先跑 ui-build)
#   make all           # 等价 ui-build + build
#
# internal/web/static/ 下的产物全部由 .gitignore 忽略, 仓库里只保留一个
# .gitkeep 占位让 //go:embed all:static 在没构建前端时也能编译; 没构建时访问
# UI 会看到 embed.go 里的 "UI 尚未构建" 提示页, API 仍然正常.
#
# 版本注入: -ldflags "-X websocket2Tcp/internal/version.Version=..." 等等。
# CLI: ws2tcp -v / ws2tcp version
# HTTP: GET /api/version

APP_NAME    := ws2tcp
PKG_VERSION := websocket2Tcp/internal/version

VERSION ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
COMMIT  := $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
DATE    := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")

LDFLAGS := -s -w \
	-X $(PKG_VERSION).Version=$(VERSION) \
	-X $(PKG_VERSION).Commit=$(COMMIT) \
	-X $(PKG_VERSION).BuildDate=$(DATE)

BUILD_DIR := build/bin
UI_DIR    := ui
EMBED_DIR := internal/web/static
LOCAL_HOME := $(CURDIR)/.ws2tcp-home

PKG := ./...

# 前端统一使用 pnpm. corepack 自动 pin 到 ui/package.json 的 packageManager.
PNPM ?= pnpm

.PHONY: all build run dev tidy fmt vet test test-unit test-service test-e2e \
	ui ui-install ui-dev ui-build ui-clean ui-lint ui-lint-fix ui-format ui-typecheck \
	web web-install web-dev web-build web-clean web-lint web-lint-fix web-format web-typecheck \
	clean release print-version

all: ui-build build

# ---- Go --------------------------------------------------------------------

build: ui-build
	@mkdir -p $(BUILD_DIR)
	go build -trimpath -ldflags "$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME) .

run: ui-build
	WS2TCP_HOME=$(LOCAL_HOME) go run -ldflags "$(LDFLAGS)" . run

dev: run

tidy:
	go mod tidy

fmt:
	go fmt $(PKG)

vet:
	go vet $(PKG)

test: test-unit

test-unit:
	WS2TCP_HOME=$(LOCAL_HOME) go test $(PKG)

test-service:
	@mkdir -p $(LOCAL_HOME)
	@echo "TODO: service-layer integration tests"

test-e2e:
	@mkdir -p $(LOCAL_HOME)
	@echo "TODO: Go<->Node interop tests under tests/interop/"

# ---- UI --------------------------------------------------------------------

ui: ui-build

ui-install:
	cd $(UI_DIR) && $(PNPM) install

ui-dev:
	cd $(UI_DIR) && $(PNPM) run dev

ui-build: ui-install
	# vite 配置里 emptyOutDir=false (避免误删 .gitkeep), 这里手动清理上次产物.
	rm -rf $(EMBED_DIR)/assets $(EMBED_DIR)/index.html
	cd $(UI_DIR) && $(PNPM) run build

ui-lint:
	cd $(UI_DIR) && $(PNPM) run lint

ui-lint-fix:
	cd $(UI_DIR) && $(PNPM) run lint:fix && $(PNPM) run format

ui-format:
	cd $(UI_DIR) && $(PNPM) run format

ui-typecheck:
	cd $(UI_DIR) && $(PNPM) run type-check

ui-clean:
	rm -rf $(UI_DIR)/node_modules $(UI_DIR)/dist
	# 保留 .gitkeep, 让 //go:embed all:static 在没构建前端时也能编译;
	# index.html 缺失由 embed.go 的占位 HTML 处理.
	find $(EMBED_DIR) -mindepth 1 -not -name '.gitkeep' -delete 2>/dev/null || true

web: ui
web-install: ui-install
web-dev: ui-dev
web-build: ui-build
web-lint: ui-lint
web-lint-fix: ui-lint-fix
web-format: ui-format
web-typecheck: ui-typecheck
web-clean: ui-clean

# ---- Misc ------------------------------------------------------------------

clean:
	rm -rf $(BUILD_DIR)

release:
	goreleaser release --snapshot --clean

print-version:
	@echo "version=$(VERSION) commit=$(COMMIT) date=$(DATE)"
