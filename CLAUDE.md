# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

websocket2Tcp 是一个 WebSocket 到 TCP 的代理工具，由 `client.mjs` 和 `server.mjs` 两个独立 Node 进程组成。本机 TCP 流量通过 WebSocket 隧道转发到远端 server，再由 server 建立到目标地址的真实 TCP 连接，实现穿透 HTTP/HTTPS 网关代理 TCP 协议（典型场景：经 nginx 反代的 SSH/数据库等）。

## 常用命令

启动 server / client（必须用 `-c` 指定配置文件路径）：

```bash
node server.mjs -c config.server.json
node client.mjs -c config.client.json
```

生成自签 SSL 证书（用于 server 直接开启 wss，未走外部反代的场景）：

```bash
./genCert.sh
```

依赖管理使用 pnpm（仓库内有 `pnpm-lock.yaml`，无 `node_modules`/`package-lock.json`）；`package.json` 仅声明 `ws`，没有 type 字段，所以 `.mjs` 后缀是必需的。仓库无测试、无 lint。

## 架构要点

### 数据流与握手

1. client 监听本地 `target.listen` 端口；每个本地 TCP 连接都会新建一条独立 WebSocket 到 server
2. WebSocket URL 形如 `<ws|wss>://host:port<wsPath>?command=<aes加密的认证串>`，认证串格式：`clientId:clientSecret:targetHost:targetPort:clientConnectionId`，使用 `server.aesKey` 做 AES-256-CBC 加密（见 `utils/aes.mjs`）
3. server 在 `upgrade` 阶段先校验 `wsPath`、可选 `wsHost`，再 `authenticate()` 解密 command 并查 `clientList`；`clientConnectionId` 在内存数组里去重，连接释放时移除，用于阻止重放
4. server 校验通过后建立到 `targetHost:targetPort` 的 TCP；TCP `connect` 事件触发后，server 通过 ws 下发一个 **streamUp 帧**（用 `aesKey` 加密），client 收到才开始 pipe — 这是 client 等待数据通道就绪的同步信号
5. streamUp 帧格式（`utils/aes.mjs` 中 `createStreamUpFrame` / `parseStreamUpFrame`）：3 字节头 `[0x01, 0x01, mode]`，mode=`0x01` 不加密、`0x02` 端到端加密；加密模式后跟 32 字节 endToEndKey。client 还兼容旧版纯文本 `"streamUp"` 字符串
6. 数据面有两种模式：
   - `useEncryption=false`：`wsStream` 与 TCP socket 直接互 pipe
   - `useEncryption=true`（默认）：在 `wsStream` 与 TCP socket 之间插入 `EncryptStream`/`DecryptStream`，使用 server 端随机生成、通过 streamUp 帧下发的 endToEndKey 做端到端 AES-256-CBC，每个数据块带 2 字节长度 + 16 字节 IV + 密文（`maxChunkSize = 32768 - 16 - 1`）
7. client 每 20s 主动 `ws.ping()` 防止 NAT/反代超时断链

### 关键约束与陷阱

- 加密层和明文层是**完全不同**的两条 pipe 链路；改动 `utils/aes.mjs` 中 `EncryptStream`/`DecryptStream` 的 chunk 切分或帧格式会同时破坏两端，必须 client 和 server 同步更新
- `clientConnectionIdList` 仅是进程内内存数组，server 重启即丢失；当前实现就是只防同一进程生命周期内的重放
- `trustProxy=true` 时按 `X-Forwarded-For` 第一个 → `X-Real-IP` → socket 顺序取 IP（`getClientIp`）；只有在 server 仅接受受信代理流量时才能开，否则客户端可伪造头（README 已警告）
- client 在握手 URL 用 `server.ip || server.host` 决定连接目标，但 `Host` 请求头和 `origin` 始终用 `server.host`，便于走 SNI / nginx 的 host 路由同时直连特定 IP
- server 的命令行参数解析是 `process.argv.slice(2)[1]`，意味着脚本依赖 `-c <path>` 这种**两段式**调用，传单个路径会失败

### 配置文件

参考 `config.client.example.json` 和 `config.server.example.json`，server 端 `useEncryption` 缺省为 `true`，`trustProxy`/`ssl` 缺省 `false`；client 端 `sslRejectUnauthorized` 缺省 `false`（自签证书友好）。

## 编码风格（来自全局规则）

- 异步统一 `async/await`，不写 Promise 链或回调嵌套
- 错误处理偏好显式返回 `[err, result]` 元组，少用 try/catch（本仓库 `authenticate` 用的是 errback 风格 `cb(err, data)`，延续即可）
- 条件分支优先 map/数组策略或 guard clauses，避免 `else if` 链
- 新增 Node 文件保持 `.mjs` 后缀（package.json 未声明 type）
