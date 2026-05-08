import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api, tokenStore } from '@/api/client'
import type {
  ClientRuntimeResponse,
  EventMessage,
  ServerStats,
  TunnelRuntimeStatus
} from '@/api/types'

const MAX_EVENTS = 30
// 定期回拉运行时状态。事件流虽然能增量更新连接计数/隧道状态,
// 但 uptime / bytes_in / bytes_out 这类汇总只能轮询;并且事件流断线时
// 也靠这个保底刷新。
const POLL_INTERVAL_MS = 3000

function tunnelKey(client: string, tunnel: string) {
  return `${client}\u0000${tunnel}`
}

function readObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function readString(value: unknown, key: string) {
  const field = readObject(value)[key]
  return typeof field === 'string' ? field : ''
}

function buildEventURL(token: string) {
  const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const url = new URL('/api/events/ws', `${scheme}//${window.location.host}`)
  url.searchParams.set('token', token)
  return url.toString()
}

export const useRuntimeStore = defineStore('runtime', () => {
  const serverStats = ref<ServerStats | null>(null)
  const tunnelStatusMap = ref<Record<string, TunnelRuntimeStatus>>({})
  const recentEvents = ref<EventMessage[]>([])
  const connected = ref(false)
  // 日志事件订阅: 每个 LogViewer 实例注册一个 listener,
  // 后端通过事件总线推送的 topic=log 消息会被广播给所有 listener,
  // 由前端按需 (client_id / tunnel / 等) 过滤显示.
  const logListeners = new Set<(event: EventMessage) => void>()

  let socket: WebSocket | null = null
  let reconnectTimer: number | null = null
  let pollTimer: number | null = null
  let closedManually = false

  const tunnels = computed(() =>
    Object.values(tunnelStatusMap.value).sort((a, b) =>
      a.client === b.client ? a.tunnel.localeCompare(b.tunnel) : a.client.localeCompare(b.client)
    )
  )

  const activeServerConnections = computed(() =>
    Object.values(serverStats.value?.client_connections ?? {}).reduce((sum, count) => sum + count, 0)
  )

  function setTunnelStatus(status: TunnelRuntimeStatus) {
    tunnelStatusMap.value = {
      ...tunnelStatusMap.value,
      [status.key]: status
    }
  }

  async function refresh() {
    const [statsErr, stats] = await api.get<ServerStats>('/api/server/stats')
    if (!statsErr && stats) {
      serverStats.value = stats
    }

    const [runtimeErr, runtime] = await api.get<ClientRuntimeResponse>('/api/client/runtime')
    if (!runtimeErr && runtime) {
      const next: Record<string, TunnelRuntimeStatus> = {}
      for (const item of runtime.tunnels ?? []) {
        next[item.key] = item
      }
      tunnelStatusMap.value = next
    }
  }

  // 后端 events.Bus 在内存里保留最近 200 条非 log 事件; 这里拉一次,
  // 让"最新事件"列表在用户刷新页面 / 重登后仍能看到 app.started /
  // server.listening 这些一次性的启动事件.
  async function loadRecentEvents() {
    const [err, list] = await api.get<EventMessage[]>('/api/events/recent')
    if (err || !list) return
    // 后端给的是 oldest-first; 列表头是最新, 所以反序合并.
    const ordered = [...list].reverse().slice(0, MAX_EVENTS)
    recentEvents.value = ordered
  }

  function pushEvent(event: EventMessage) {
    recentEvents.value = [event, ...recentEvents.value].slice(0, MAX_EVENTS)
  }

  function applyServerConnectionDelta(clientID: string, delta: number) {
    if (!clientID) return
    const current = serverStats.value
    if (!current) return
    const next = { ...(current.client_connections ?? {}) }
    next[clientID] = Math.max(0, (next[clientID] ?? 0) + delta)
    serverStats.value = { ...current, client_connections: next }
  }

  function handleEvent(raw: string) {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return
    }
    const payload = readObject(parsed)
    const event: EventMessage = {
      topic: readString(payload, 'topic'),
      time: readString(payload, 'time'),
      data: readObject(payload.data)
    }
    if (!event.topic) return

    if (event.topic === 'log') {
      // 不进入 recentEvents — 日志体量大, 只发给注册了 listener 的 viewer.
      for (const fn of logListeners) fn(event)
      return
    }

    pushEvent(event)

    if (event.topic === 'tunnel.state') {
      const client = readString(event.data, 'client')
      const tunnel = readString(event.data, 'tunnel')
      if (!client || !tunnel) return
      const key = tunnelKey(client, tunnel)
      const previous = tunnelStatusMap.value[key]
      setTunnelStatus({
        key,
        client,
        tunnel,
        endpoint: readString(event.data, 'endpoint') || previous?.endpoint || '',
        listen: readString(event.data, 'listen') || previous?.listen || '',
        state: readString(event.data, 'state') || previous?.state || 'unknown',
        error: readString(event.data, 'error') || '',
        active_connections: previous?.active_connections ?? 0,
        updated_at: event.time || new Date().toISOString()
      })
      return
    }

    if (event.topic === 'tunnel.removed') {
      const client = readString(event.data, 'client')
      const tunnel = readString(event.data, 'tunnel')
      if (!client || !tunnel) return
      const key = tunnelKey(client, tunnel)
      if (key in tunnelStatusMap.value) {
        const next = { ...tunnelStatusMap.value }
        delete next[key]
        tunnelStatusMap.value = next
      }
      return
    }

    if (event.topic === 'server.conn.opened') {
      applyServerConnectionDelta(readString(event.data, 'client_id'), 1)
      return
    }

    if (event.topic === 'server.conn.closed') {
      applyServerConnectionDelta(readString(event.data, 'client_id'), -1)
    }
  }

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function startPolling() {
    if (pollTimer !== null) return
    pollTimer = window.setInterval(() => {
      refresh()
    }, POLL_INTERVAL_MS)
  }

  function stopPolling() {
    if (pollTimer !== null) {
      window.clearInterval(pollTimer)
      pollTimer = null
    }
  }

  function connect() {
    const token = tokenStore.get()
    if (socket || !token) return
    closedManually = false
    clearReconnectTimer()
    startPolling()
    loadRecentEvents()

    socket = new WebSocket(buildEventURL(token))
    socket.onopen = () => {
      connected.value = true
    }
    socket.onmessage = event => {
      if (typeof event.data === 'string') {
        handleEvent(event.data)
      }
    }
    socket.onclose = () => {
      connected.value = false
      socket = null
      if (closedManually || !tokenStore.get()) return
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null
        connect()
      }, 2000)
    }
    socket.onerror = () => {
      connected.value = false
    }
  }

  function disconnect() {
    closedManually = true
    clearReconnectTimer()
    stopPolling()
    connected.value = false
    if (socket) {
      socket.close()
      socket = null
    }
  }

  function tunnelStatus(client: string, tunnel: string) {
    return tunnelStatusMap.value[tunnelKey(client, tunnel)] ?? null
  }

  function onLog(fn: (event: EventMessage) => void) {
    logListeners.add(fn)
    return () => logListeners.delete(fn)
  }

  return {
    serverStats,
    tunnels,
    recentEvents,
    connected,
    activeServerConnections,
    refresh,
    connect,
    disconnect,
    tunnelStatus,
    onLog,
    loadRecentEvents
  }
})
