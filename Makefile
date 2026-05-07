# ws2tcp — top-level Makefile
#
# 构建模型:
#   make dev / run     # 不构建前端, Go 二进制内嵌一个 "UI 未构建" 占位页;
#                      # 前端走 `make ui-dev` 起的 vite (5173) 直连即可.
#   make ui-build      # 单独构建 SPA 到 internal/web/static/
#   make build         # 构建发布二进制 (会先跑 ui-build, 并加 -tags embedui
#                      # 把 SPA 嵌入).
#   make all           # 等价 ui-build + build
#
# 默认构建不引用 internal/web/static/, 所以仓库里不再保留 .gitkeep —
# embed 由 internal/web/embed_ui.go (带 //go:build embedui) 在发布构建里
# 接管, 开发模式下 internal/web/embed.go 的占位 handler 兜底.
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
DIST_DIR  := build/dist
UI_DIR    := ui
EMBED_DIR := internal/web/static
LOCAL_HOME := $(CURDIR)/.ws2tcp-home

PKG := ./...

# 前端统一使用 pnpm. corepack 自动 pin 到 ui/package.json 的 packageManager.
PNPM ?= pnpm

# 跨平台发布矩阵 (GOOS/GOARCH). 想砍/加一行直接改这里, 下游目标都会自动同步.
# 选型理由:
#   - darwin/amd64    Intel Mac
#   - darwin/arm64    Apple Silicon
#   - linux/amd64     主流服务器
#   - linux/arm64     树莓派 4/5、AWS Graviton、腾讯/阿里 ARM 实例
#   - linux/arm       armv7 (老树莓派、路由器)
#   - windows/amd64   Win10/11 x64
#   - windows/arm64   Surface Pro X 等
DIST_TARGETS := \
	darwin/amd64 \
	darwin/arm64 \
	linux/amd64 \
	linux/arm64 \
	linux/arm \
	windows/amd64 \
	windows/arm64

.PHONY: all build run dev tidy fmt vet test test-unit test-e2e \
	ui ui-install ui-dev ui-build ui-clean ui-lint ui-lint-fix ui-format ui-typecheck \
	web web-install web-dev web-build web-clean web-lint web-lint-fix web-format web-typecheck \
	clean release print-version dist dist-clean dist-list

all: ui-build build

# ---- Go --------------------------------------------------------------------

# 发布二进制: 先构建前端, 再用 -tags embedui 让 internal/web/embed_ui.go
# 把 internal/web/static/ 嵌进来. 没这一步 (例如 `go build .`) 也能编译,
# 只是访问 / 时拿到 "UI 未构建" 占位页.
build: ui-build
	@mkdir -p $(BUILD_DIR)
	go build -trimpath -tags embedui -ldflags "$(LDFLAGS)" -o $(BUILD_DIR)/$(APP_NAME) .

run:
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

# 端到端测试: 真正起一份 ws2tcp server + client + tunnel, 通过本地 echo
# target 验证字节往返. 每个用例自带 t.TempDir() 当 WS2TCP_HOME, 跑完
# Go 测试框架自动清理. 默认 (`make test`) 不跑, 用 -tags e2e 显式启用.
test-e2e:
	go test -tags e2e -count=1 -timeout 60s ./internal/e2e/...

# ---- UI --------------------------------------------------------------------

ui: ui-build

ui-install:
	cd $(UI_DIR) && $(PNPM) install

ui-dev:
	cd $(UI_DIR) && $(PNPM) run dev

ui-build: ui-install
	# vite 配置里 emptyOutDir=false; 这里手动清理上次产物.
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
	rm -rf $(EMBED_DIR)

web: ui
web-install: ui-install
web-dev: ui-dev
web-build: ui-build
web-lint: ui-lint
web-lint-fix: ui-lint-fix
web-format: ui-format
web-typecheck: ui-typecheck
web-clean: ui-clean

# ---- 跨平台发布构建 --------------------------------------------------------
#
# 用法:
#   make dist                      # 构建 DIST_TARGETS 里的全部平台
#   make dist DIST_TARGETS=...     # 只构指定子集 (如 "linux/amd64 linux/arm64")
#   make dist-list                 # 看当前矩阵
#   make dist-clean                # 清空 build/dist/
#
# 产物命名: build/dist/ws2tcp_<version>_<os>_<arch>[.exe]
# 同目录另写一份 SHA256SUMS, 方便发布页贴到 GitHub Release 里校验.
#
# 全部用 CGO_ENABLED=0 + -trimpath, 输出静态二进制, 不依赖 host 的 libc 版本.
# Web UI 走一次 ui-build, 多个目标共享同一份 internal/web/static/, 省时间.

dist: ui-build
	@mkdir -p $(DIST_DIR)
	@rm -f $(DIST_DIR)/SHA256SUMS
	@for target in $(DIST_TARGETS); do \
		os=$${target%/*}; arch=$${target#*/}; \
		ext=""; \
		if [ "$$os" = "windows" ]; then ext=".exe"; fi; \
		out="$(DIST_DIR)/$(APP_NAME)_$(VERSION)_$${os}_$${arch}$${ext}"; \
		echo ">> building $$out"; \
		CGO_ENABLED=0 GOOS=$$os GOARCH=$$arch \
			go build -trimpath -tags embedui \
				-ldflags "$(LDFLAGS)" \
				-o "$$out" . || exit 1; \
	done
	@echo ">> writing $(DIST_DIR)/SHA256SUMS"
	@cd $(DIST_DIR) && \
		( command -v sha256sum >/dev/null && sha256sum $(APP_NAME)_$(VERSION)_* > SHA256SUMS ) || \
		shasum -a 256 $(APP_NAME)_$(VERSION)_* > SHA256SUMS
	@ls -lh $(DIST_DIR)

dist-clean:
	rm -rf $(DIST_DIR)

dist-list:
	@echo "DIST_TARGETS:"
	@for t in $(DIST_TARGETS); do echo "  $$t"; done

# ---- Misc ------------------------------------------------------------------

clean:
	rm -rf $(BUILD_DIR) $(DIST_DIR)

# goreleaser 是另一条独立的发布路线 (.goreleaser.yaml 自行维护); 留这个
# 入口给以后接 GitHub Release 用. 仓库里目前没有 .goreleaser.yaml,
# 所以这条命令需要先手动加配置文件再跑.
release:
	goreleaser release --snapshot --clean

print-version:
	@echo "version=$(VERSION) commit=$(COMMIT) date=$(DATE)"
