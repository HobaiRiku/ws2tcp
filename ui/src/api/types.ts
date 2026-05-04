// 与后端 internal/api 的 JSON schema 对齐。redact 后的字段 (Secret/AESKey)
// 永远不会回到前端,所以这里也不暴露它们。

export type VersionInfo = {
  version: string
  commit: string
  build_date: string
  go_version: string
}

export type AuthStatus = {
  auth_required: boolean
}

export type ACLRule = {
  cidr: string
  ports: string[]
}

export type ServerClient = {
  id: string
  acl: ACLRule[]
  secret?: string
}

export type ServerStats = {
  bytes_in: number
  bytes_out: number
  uptime_seconds: number
  client_connections: Record<string, number>
}

export type ServerSettings = {
  listen: string
  ws_path: string
  ws_host: string
  trust_proxy: boolean
  use_encryption: boolean
  tls_enabled: boolean
}

export type Endpoint = {
  name: string
  host: string
  ip?: string
  port: number
  path: string
  wss: boolean
  aes_key?: string
  ssl_reject_unauthorized?: boolean
}

export type Tunnel = {
  name: string
  listen: string
  target_host: string
  target_port: number
}

export type ClientProfile = {
  name: string
  client_id: string
  endpoint: string
  client_secret?: string
  tunnels: Tunnel[]
}

export type TunnelRuntimeStatus = {
  key: string
  client: string
  tunnel: string
  endpoint: string
  listen: string
  state: string
  error?: string
  active_connections: number
  updated_at: string
}

export type ClientRuntimeResponse = {
  tunnels: TunnelRuntimeStatus[]
}

export type EventMessage = {
  topic: string
  time: string
  data?: Record<string, unknown>
}

export type ConfigDocument = Record<string, unknown>
