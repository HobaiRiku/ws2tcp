# ws2tcp — top-level Makefile
#
# Build pipeline:
#   make web-install   # 一次性: 装前端依赖 (pnpm)
#   make web-build     # 构建 SPA 到 internal/web/static/
#   make build         # 构建 Go 二进制 (注入 git 版本到 ldflags)
#   make all           # 等价 web-build + build
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
WEB_DIR   := web
EMBED_DIR := internal/web/static

PKG := ./...

# 前端统一使用 pnpm. corepack 自动 pin 到 web/package.json 的 packageManager.
PNPM ?= pnpm

.PHONY: all build run dev tidy fmt vet test test-unit test-service test-e2e \
	web web-install web-dev web-build web-clean clean release print-version

all: web-build build

# ---- Go --------------------------------------------------------------------

build:
	@mkdir -p $(BUILD_DIR)
	go build -trimpath -ldflags "$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME) .

run:
	go run -ldflags "$(LDFLAGS)" . run

dev: run

tidy:
	go mod tidy

fmt:
	go fmt $(PKG)

vet:
	go vet $(PKG)

test: test-unit

test-unit:
	go test $(PKG)

test-service:
	@echo "TODO: service-layer integration tests"

test-e2e:
	@echo "TODO: Go<->Node interop tests under tests/interop/"

# ---- Web -------------------------------------------------------------------

web: web-build

web-install:
	cd $(WEB_DIR) && $(PNPM) install

web-dev:
	cd $(WEB_DIR) && $(PNPM) run dev

web-build: web-install
	cd $(WEB_DIR) && $(PNPM) run build

web-clean:
	rm -rf $(WEB_DIR)/node_modules $(WEB_DIR)/dist
	# 保留 placeholder index.html 让 go test 在没构建前端时也通过
	find $(EMBED_DIR) -type f ! -name 'index.html' -delete 2>/dev/null || true

# ---- Misc ------------------------------------------------------------------

clean:
	rm -rf $(BUILD_DIR)

release:
	goreleaser release --snapshot --clean

print-version:
	@echo "version=$(VERSION) commit=$(COMMIT) date=$(DATE)"
