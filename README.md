# ws2tcp

> 把 TCP 流量经 WebSocket 隧穿过 HTTP/HTTPS 反向代理 — 单二进制、自带 Web 管理面板。

ws2tcp 是一个 WebSocket → TCP 代理工具。在反向代理只放 HTTP(S) 流量、却又需要让 SSH / 数据库 / 自定义 TCP 协议从外面进来的场景里，把客户端 TCP 连接包成 WebSocket 上行到服务端，再由服务端拨号到真实 TCP 目标。

```
┌──────────┐  TCP    ┌────────────┐  WS / WSS   ┌────────────┐  TCP   ┌──────────┐
│ ssh / db │ ─────▶  │ ws2tcp     │ ──────────▶ │ nginx /    │ ─────▶ │ ws2tcp   │ ─────▶ target:22 / :3306 / ...
│ client   │         │ (client)   │             │ caddy /…   │        │ (server) │
└──────────┘         └────────────┘             └────────────┘        └──────────┘
                       本地监听                   仅放 HTTP(S)            内网拨号
```

同一个二进制可以同时做 server、client 或两者，配置由 `~/.ws2tcp/config.yaml` 驱动。Web 管理面板内嵌进二进制，访问 `http://127.0.0.1:7321` 即可增删改 endpoint / tunnel / client，并实时看连接数与日志。

---

## 主要特性

- **单二进制**：Go 实现，跨平台 (macOS / Linux / Windows)，静态链接，无运行时依赖。
- **服务化运行**：基于 [`kardianos/service`](https://github.com/kardianos/service)，一条 `ws2tcp install` 注册成 launchd / systemd / Windows SCM 服务。
- **Web 管理面板**：内嵌 Vue 3 SPA，无需额外部署。
- **端到端加密**：信令层 AES-256 (固定 key)，数据面可选每连接一次性 32 字节 e2e key (`use_encryption=true`)。
- **ACL**：每个 server-side client 可挂 CIDR + 端口范围白名单，签发不同凭据。
- **热配置**：API 改完即生效；listen / TLS / aes_key 这类传输层字段自动重启对应子系统而不是整进程。

---

## 适用场景

- 内网 SSH / 数据库需要从外网访问，但出口只放 80/443
- 已有 HTTPS 反代 (nginx, caddy, Cloudflare 等)，想复用证书与边界鉴权
- 把私有 TCP 协议串联到 CI / SaaS 的 webhook 链路

---

## 使用注意事项

- 仅应在**管理员或系统所有者明确授权**的前提下使用，尤其是生产环境、公司网络、云主机、堡垒机和数据库网段。
- `aes_key`、`http_token`、`client_id`、`client_secret` 等都应视为敏感凭据，避免提交到仓库、聊天记录、工单截图或公开日志。
- 建议为不同环境、不同 client 分配独立凭据，最小化 ACL 授权范围，并定期轮换密钥和 secret。
- 如果用于生产运维，建议通过 HTTPS/WSS 反向代理、限制管理面访问来源，并确保日志与配置文件权限只对受信账号开放。

---

## 快速开始

### 通过 Homebrew 安装

```bash
brew tap HobaiRiku/tap
brew install --cask ws2tcp
ws2tcp version
ws2tcp run
```

首次启动会生成 `~/.ws2tcp/config.yaml`，含一个随机的管理 token、一把随机 AES key，以及一份可直接自测的样例配置。

打开 `http://127.0.0.1:7321`，从 `~/.ws2tcp/config.yaml` 里 `app.http_token` 复制 token 登录，即可开始配置。

### 安装为系统服务

```bash
sudo ws2tcp install       # 注册成 launchd/systemd/SCM
sudo ws2tcp start
ws2tcp status
```

服务环境会把 `WS2TCP_HOME` pin 到安装时的解析路径，避免 root 起服务时找不到用户配置。

### 下载或自行构建

```bash
git clone https://github.com/HobaiRiku/ws2tcp.git
cd ws2tcp
make build               # 产物: build/bin/ws2tcp (含 Web UI)
./build/bin/ws2tcp version
./build/bin/ws2tcp run
```

构建依赖：Go 1.23+、`pnpm` (或 `corepack enable`)，`make`。

---

## 配置示例

```yaml
app:
  http_listen: 127.0.0.1:7321
  http_auth: true
  http_token: 7c2d4b...e1               # 首次 init 自动随机生成
  log_level: info
  log_console: false                   # 同时镜像到 stderr/stdout（默认关闭）
  log_max_size_mb: 20
  log_max_backups: 10
  log_max_age_days: 14
  log_compress: false

server:
  listen: 0.0.0.0:3005
  ws_path: /connect
  aes_key: njpjvjkgfykgpqpcksvjydvlctgznlnz   # 32 字节, 信令层
  use_encryption: true                  # 数据面端到端加密
  trust_proxy: false
  tls:
    enabled: false
    cert: certs/cert.pem
    key:  certs/key.pem
  clients:
    - id: alice
      secret: alice-secret
      acl:
        - cidr: 192.168.1.0/24
          ports: ["22", "3306"]

client:
  endpoints:
    - name: edge
      host: gateway.example.com
      port: 443
      path: /connect
      wss: true
      aes_key: njpjvjkgfykgpqpcksvjydvlctgznlnz
      ssl_reject_unauthorized: true
  clients:
    - name: my-laptop
      endpoint: edge
      client_id: alice
      client_secret: alice-secret
      tunnels:
        - name: ssh
          listen: 127.0.0.1:2222
          target_host: 10.0.0.10
          target_port: 22
```

---

## Nginx 反向代理示例

假设：

- 公网域名：`tunnel.example.com`
- ws2tcp server 监听：`127.0.0.1:3005`
- `server.ws_path`：`/connect`

建议的 `location` 配置：

```nginx
location /connect {
    proxy_pass http://127.0.0.1:3005;
    proxy_http_version 1.1;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
    proxy_buffering off;
}
```

建议同时注意：

- `location` 路径要和 `server.ws_path` 完全一致。
- 如果前面已经由 Nginx 终止 TLS，ws2tcp server 可以只监听本地 HTTP；外部 client 侧使用 `wss: true` 即可。
- 如果你打算让 ACL 基于真实来源 IP 生效，再配合 `server.trust_proxy=true` 使用，并确保前置代理是你自己可控的。

---

## 命令一览

```text
ws2tcp run          # 前台运行
ws2tcp install      # 注册为 OS 服务 (kardianos)
ws2tcp uninstall    # 注销
ws2tcp start/stop   # 通过 OS 服务管理器启停
ws2tcp status       # 当前服务状态
ws2tcp tail         # 最近 10 条日志 + 实时跟踪

ws2tcp server …         # server show|enable|disable|update
ws2tcp server-client …  # server-side client identity CRUD
ws2tcp endpoint …       # reusable endpoint CRUD
ws2tcp client …         # client profile CRUD
ws2tcp tunnel …         # tunnel CRUD / global listing
ws2tcp config …     # 查看 / 校验 / 导出配置
ws2tcp version      # 版本 + 构建信息
```

所有命令都接受 `--home <path>` 覆盖 `WS2TCP_HOME` 环境变量。

日志默认同时写入两处：

- `logs/ws2tcp.log`（带内建翻转与保留策略）
- 进程 stderr/stdout（便于 `ws2tcp run`、launchd、systemd、SCM 接管）

`app.log_console` 默认是 `false`。只有在你明确希望同时把日志镜像到 stderr/stdout（例如前台调试）时再打开；系统服务场景建议继续保持关闭，只保留 `logs/` 这一套可控日志。

---

## 架构

```
       ┌────────────── ws2tcp 二进制 ──────────────┐
       │                                            │
       │  cmd/ (cobra)         internal/service/    │
       │     │                       │              │
       │     └─────────► internal/app/ (Run)        │
       │                       │                    │
       │     ┌─────────────────┼───────────────────┐│
       │     ▼                 ▼                   ▼│
       │ internal/api/   internal/services/  internal/core/
       │ (gin REST + WS) (registry/runtime/   (server, client,
       │     │            auth/ACL/listen)     wsproxy, crypto,
       │     ▼                                  frame)
       │ internal/web/                                │
       │ (embed.FS for SPA)                           │
       │                                              │
       └──────────────────────────────────────────────┘
```

- **`internal/core/server`** 负责 WS upgrade、handshake 校验、replay 防护、目标 dial、streamUp 帧。
- **`internal/core/client`** 监听本地 TCP，每接受一条就开一条独立 ws，等服务端的 streamUp 后桥接。
- **`internal/core/wsproxy`** 双向 `io.Copy`，关闭分类聪明 (EOF / EPIPE / ECONNRESET / use of closed connection 等都不当告警)。
- **`internal/services/registry`** 用 `atomic.Pointer[snapshot]` 做无锁热路径，写入走 `Apply`，已建立的连接持有旧快照不会半更新。
- **`internal/services/events`** 进程内事件总线，所有 slog 日志、tunnel 状态变更、连接增减都会广播。
- **`internal/web/embed.go`** 默认占位；`internal/web/embed_ui.go` (`//go:build embedui`) 才真正 `//go:embed` SPA — `make build` 会带上这个 tag。

详细设计见 `docs/design/`。

---

## 开发

```bash
# 后端 + 占位 UI (访问 / 拿到 "UI 未构建" 提示页)
make run

# 在另一个终端起 vite (端口 5266), /api 自动 proxy 到 7321
make ui-dev
```

```bash
make test            # 单元测试 (秒级)
make test-e2e        # in-process 端到端: 真起 server+client+tunnel, 经 echo target 字节回环
make ui-typecheck    # 前端类型检查
make ui-lint         # 前端 lint
```

---


## 原 Node.js 实现

仓库 `legacy/` 保留原 Node 实现 (`client.mjs` + `server.mjs`)，仅作为 wire-format 参考。当前主线开发都在 Go 二进制上：单进程同时跑两个角色、自带管理面板、可服务化、有 e2e 套件。

帧格式 (handshake + streamUp + e2e 加密分块) 与 Node 版兼容；只要双端 `aes_key` 一致，新旧实现可以互通。

---

## 协议许可

[MIT License](LICENSE) © 2026 HobaiRiku
