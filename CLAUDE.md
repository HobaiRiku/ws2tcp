# CLAUDE.md

This file guides Claude Code (claude.ai/code) when working in this repository.

## 项目概述

ws2tcp 是一个把 TCP 流量经 WebSocket 隧道穿过 HTTP/HTTPS 反向代理的工具，**单个 Go 二进制**同时承担三种角色:

- **server**: 接受 WS 升级 → 解密 handshake → 拨号目标 TCP → 桥接两端
- **client**: 本地 TCP listener (tunnel) → 拨号 WS → 等服务端 streamUp 后桥接
- **管理面**: gin REST API + 内嵌 Vue SPA (`/api`, `/`)

历史 Node.js 实现保留在 `legacy/` 仅作参考。

## 常用命令

```bash
# 开发 (双终端)
make run                # 起 Go 进程, 不构建前端 (访问 / 拿到占位页)
make ui-dev             # 起 vite 开发服 (默认 5266), /api 走 proxy 转 7321

# 单元测试 (秒级, 默认跑)
make test

# 端到端 (in-process server+client+tunnel 真实 TCP 字节回环)
make test-e2e

# 发布二进制 (会先 ui-build, 再 -tags embedui 把 SPA 嵌入)
make build
```

CLI 子命令: `ws2tcp run | install | uninstall | start | stop | status | client | server | config | version`。所有子命令都接受 `--home`，覆盖 `WS2TCP_HOME` 环境变量。

## 目录与依赖关系

```
main.go                      → 区分 interactive / service-managed, 分别走 cmd 或 internal/service
cmd/                         cobra 命令树, 依赖 internal/service 和 internal/config
internal/
  app/                       composition root: app.Run 把所有子系统串起来
  service/                   kardianos/service 包装 + log.Init bootstrap
  config/                    YAML schema + load + validate + atomic write (yaml.Node 保留注释/顺序)
  paths/                     WS2TCP_HOME 解析 + 目录权限
  services/                  registry/runtime/auth/ACL 等服务层 (热路径无锁)
  services/events/           in-mem 事件总线 (topic 订阅 + 非阻塞投递)
  api/                       gin REST 路由 + ServerControl(restart) + 鉴权中间件
  api/ws/                    SSE / WebSocket 事件流 handler
  log/                       slog fanout (file+stderr+Tap), Tap = 环形缓冲 + 可挂 publisher
  web/                       embed.go (默认占位) + embed_ui.go (//go:build embedui 真嵌入)
  core/server/               WS upgrade handler + replay store
  core/client/               tunnel manager + per-tunnel listener
  core/wsproxy/              ws<->tcp 双向 io.Copy + 关闭分类
  core/crypto/               AES-256-CBC + 流式 EncryptWriter/DecryptReader
  core/frame/                streamUp 帧 (3 字节头 + 可选 32 字节 e2e key)
  e2e/                       //go:build e2e 端到端 harness + 用例
ui/                          Vue 3 + TS + Vite + Pinia + vue-i18n + Fluent UI custom elements
docs/design/                 子系统设计文档 (00-overview / 01-config / ... / 06-build-and-testing)
```

依赖方向严格: `cmd` → `service` → `app` → `services` / `core` / `api` / `web`。`core/*` 之间互相独立，靠 `services` 与 `api` 把它们组装起来。

## 数据流与帧格式 (核心不变量)

1. client tunnel 接到本地 TCP → 生成随机 connID → AES 加密 `clientID:clientSecret:targetHost:targetPort:connID` 当作 query `?command=`
2. WS dial 到 `ws://endpoint.host:port<path>?command=...`，URL 用 `endpoint.IP || endpoint.Host` 解析，`Host` 头始终是 `endpoint.Host` (兼容 SNI / nginx host 路由)
3. server 在 upgrade 前: 校验 path/host → 解密 command → `registry.Verify` → `replay.Reserve(connID)` (进程内反重放) → ACL → dial target
4. dial 成功后 server 通过 ws 发一条 **streamUp 帧** (用 `server.aes_key` 加密): 3 字节头 `[0x01,0x01,mode]`, mode=`0x01` 不加密 / `0x02` 端到端加密时附 32 字节随机 e2e key
5. 双端进入 `wsproxy.Bridge`:
   - `useEncryption=false`: ws conn 与 TCP socket 直接 `io.Copy`
   - `useEncryption=true`: ws 一侧套 `EncryptStream`/`DecryptStream`, AES-256-CBC, 每块格式 `2字节长度 + 16字节IV + 密文`, `maxChunkSize = 32768 - 16 - 1`
6. client 每 20s ws.Ping 防 NAT/反代闲置超时

**关键约束**: `core/crypto`、`core/frame` 改格式必须双端同步，否则旧 client 连不上新 server。streamUp 兼容旧版 `"streamUp"` 纯文本一段过渡期。

## 配置与持久化

- `config.yaml` 在 `WS2TCP_HOME` 下 (默认 `$HOME/.ws2tcp/`)
- 加载链路: `paths.Resolve` → `config.Load` → `applyTrueDefaults` → YAML 解码 → `dropEmptyPlaceholders` → `applyZeroDefaults` → `Validate`
- **`http_token` 没有兜底默认**: 缺失就保持 `""`, `services.AuthService` 在 expected token 为空时直接 401。这是"空 config = API 关闭"的安全契约，别绕过。
- 写入: `services/config_ops.go` 用 `yaml.Node` 增量改动, 通过 `WriteAtomic` (`<path>.tmp` + Rename) 保证原子性, 读回触发 `Registry.Apply` 重建快照
- `Registry.Apply` 把新 config 编译成 immutable `snapshot` 并 atomic.Store; 已建立的连接持有旧快照, 不会半更新
- transport-affecting 字段 (listen / ws_path / aes_key / TLS) PATCH 后会触发 `serverSupervisor.Restart` 重建 server 子系统; 其它字段热应用

## 鉴权与 token

- `app.http_auth=true` 时所有 API 必须带 `Authorization: Bearer <token>` 或 `?token=`
- `Registry.HTTPToken()` 提供当前 token; `AuthService.VerifyToken` 用 `subtle.ConstantTimeCompare` 比对
- `WriteExample()` 在 init 时通过 `crypto/rand` 生成 16 字节熵 (32 hex 字符) 作为初始 token
- 即便 `http_auth=true && http_token=""` 进程也启动, 只是 API 全部 401, 留给 operator 改 config 的窗口 (服务管理器自启时启动失败更难排查)

## 端口与 listen 校验

`services/listen.go` 三层校验:

1. **格式**: `host:port`, port ∈ 1..65535 (**0 不允许**, 因为对长期 tunnel 没意义)
2. **配置内冲突**: 扫所有 `client.clients[*].tunnels[*].listen`, 重复就拒
3. **OS 探测**: `net.Listen` 试一次, 占用就拒 (Update 时若 listen 未变则跳过, 避免与自己当前 bound listener 打架)

`listenProbe` 是包级变量, 测试通过赋值 stub 它 (见 `services_test.go` 与 `listen_test.go`)。

## 日志

- `internal/log.Init` 返回 fanout 后的 `*slog.Logger` + `*Tap`
- 三路输出: `logs/ws2tcp.log` (JSON, 0600), 可选 stderr 文本, **必有的内存 Tap**
- Tap = 500 条环形缓冲 + 可挂 publisher。`app.Run` 把 publisher 接到事件总线 topic=`log`, 所以前端 `/api/events/ws` 能实时拿到每条 slog
- 接到 attr 时把 `error` / `fmt.Stringer` / 复合类型字符串化, 避免前端 JSON 渲染成 `[object Object]`
- `wsproxy.isExpectedClose` 已经吞掉 EOF / `net.ErrClosed` / `ECONNRESET` / `EPIPE` / `context.Canceled` / "use of closed network connection" / "broken pipe" / "websocket: close" 等正常断连; 桥接残留错误从 Warn 降到 Info, 不扰民

## 前端

- Vite outDir = `internal/web/static` (gitignored)。**默认 Go 构建不引用此目录**, embed 由 `internal/web/embed_ui.go` (`//go:build embedui`) 接管
- `make dev` 走占位 handler, vite (5266) 自己服 SPA, `/api` 走 proxy 到 7321
- 状态: Pinia stores (`auth` / `runtime` / `version`)
  - `runtime` store 同时跑 WS 事件流 + 3s 轮询 (uptime / bytes 这类无事件汇总靠轮询保底)
  - 列表页 (Server / Clients / Endpoints) 通过 `useAutoRefresh` 5s 重拉
- `LogViewer.vue` 复用: Server 页 (server 进程 + 单 client 行) + Clients 页 (profile + tunnel 行) 都能弹窗看实时日志, 历史走 `/api/logs/recent`, 增量走事件流 topic=`log`
- Clients 页所有 profile 默认展开 (新加载的也是)

## 测试约定

```bash
make test           # 默认: 所有不带 build tag 的 Go 测试
make test-e2e       # -tags e2e, 跑 internal/e2e/...
go test -tags embedui ./internal/web/...   # 验真嵌入路径
```

- e2e harness 每个用例 `t.TempDir()` 拿独立 WS2TCP_HOME, 测完 Go 测试框架自动 `rm -rf`, 不污染 dev 环境
- e2e 不需要外部进程, 直接 `app.Run` 在 goroutine 里跑 + 本地 echo target server
- 端口冲突测试 stub `listenProbe`; 真实绑端口的测试用 `freePort` 拿 ephemeral

## 构建模式速查

| 命令 | UI | embed tag | 用途 |
|---|---|---|---|
| `make run` / `make dev` | 不 build | 无 | 本地开发, 配 `make ui-dev` 双进程 |
| `make build` | build | `-tags embedui` | 发布单二进制 |
| `make test` | 不需要 | 无 | 单元测试 |
| `make test-e2e` | 不需要 | `-tags e2e` | in-process 端到端 |
| `go build .` | 不需要 | 无 | 临时构建, 访问 / 拿占位页 |
| `go build -tags embedui .` | 需要 static 已填充 | `-tags embedui` | 复刻 `make build` |

## 编码风格 (来自 ~/.claude/CLAUDE.md 全局规则)

- 异步统一 `async/await`(ts) 或 `context` 取消(go), 不写 Promise 链 / 回调嵌套 / `time.Sleep` 轮询
- Go 错误: 显式 `[err, result]` 风格优先 (TS 已经这样); Go 这边接续 errback / `error` 返回, 少 try-catch / 少 panic
- 条件分支优先 map / guard clauses, 避免 `else if` 链
- 新增 Go 文件直接在 `internal/<pkg>/`; 新增 Node/TS 文件 `.mjs` (本仓库 package.json 无 type)
- 注释只写 *为什么*, 不写 *做了什么*
- Markdown 代码块前后留空行 (兼容钉钉文档)
