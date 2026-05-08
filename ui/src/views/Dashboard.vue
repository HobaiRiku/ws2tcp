<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRuntimeStore } from '@/stores/runtime'
import { formatBytes, formatDuration, formatLocalTime, formatTimeAgo } from '@/utils/format'
import { useI18n } from 'vue-i18n'
import IconBtn from '@/components/IconBtn.vue'

const runtime = useRuntimeStore()
const { t } = useI18n()

onMounted(() => {
  runtime.refresh()
})

const tunnelCounts = computed(() => ({
  listening: runtime.tunnels.filter(item => item.state === 'listening').length,
  starting: runtime.tunnels.filter(item => item.state === 'starting').length,
  error: runtime.tunnels.filter(item => item.state === 'error').length
}))

function statusClass(state: string) {
  if (state === 'error') return 'badge-error'
  if (state === 'listening') return 'badge-ok'
  if (state === 'starting') return 'badge-info'
  return 'badge-neutral'
}

const eventLabels: Record<string, string> = {
  'app.started': 'dashboard.eventAppStarted',
  'server.listening': 'dashboard.eventServerListening',
  'api.listening': 'dashboard.eventApiListening',
  'client.manager.started': 'dashboard.eventClientManagerStarted',
  'tunnel.state': 'dashboard.eventTunnelState',
  'tunnel.removed': 'dashboard.eventTunnelRemoved',
  'server.conn.opened': 'dashboard.eventConnOpened',
  'server.conn.closed': 'dashboard.eventConnClosed'
}

function describeEvent(topic: string) {
  const key = eventLabels[topic]
  return key ? t(key) : topic
}

// 把 data 里几个关键字段拼成一句副标题, 方便不展开 JSON 也能看到关键信息.
function eventDetail(topic: string, data: Record<string, unknown> | undefined): string {
  const get = (k: string) => (data && k in data ? String(data[k]) : '')
  if (topic === 'app.started') {
    const v = get('version')
    const c = get('commit')
    return [v && `v${v}`, c && c].filter(Boolean).join(' · ')
  }
  if (topic === 'server.listening') {
    return [get('addr'), get('ws_path'), get('tls') === 'true' ? 'tls' : ''].filter(Boolean).join(' · ')
  }
  if (topic === 'api.listening') return get('addr')
  if (topic === 'client.manager.started') return `${get('profiles')} profiles`
  if (topic === 'tunnel.state' || topic === 'tunnel.removed') {
    return [get('client'), get('tunnel'), get('state')].filter(Boolean).join(' · ')
  }
  if (topic === 'server.conn.opened' || topic === 'server.conn.closed') {
    const id = get('client_id')
    const ip = get('client_ip')
    const host = get('target_host')
    const port = get('target_port')
    const target = host && port ? `→ ${host}:${port}` : ''
    return [id, ip, target].filter(Boolean).join(' · ')
  }
  return ''
}
</script>

<template>
  <section class="page dashboard-page">
    <div class="page-toolbar">
      <h1 class="page-title">{{ t('dashboard.title') }}</h1>
      <div class="toolbar-actions">
        <IconBtn icon="refresh" :title="t('common.refresh')" @click="runtime.refresh()" />
      </div>
    </div>

    <div class="stat-grid">
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.uptime') }}</span>
        <strong>{{ formatDuration(runtime.serverStats?.uptime_seconds ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.serverBytesIn') }}</span>
        <strong>{{ formatBytes(runtime.serverStats?.server_bytes_in ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.serverBytesOut') }}</span>
        <strong>{{ formatBytes(runtime.serverStats?.server_bytes_out ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.clientBytesIn') }}</span>
        <strong>{{ formatBytes(runtime.serverStats?.client_bytes_in ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.clientBytesOut') }}</span>
        <strong>{{ formatBytes(runtime.serverStats?.client_bytes_out ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.activeConnections') }}</span>
        <strong>{{ runtime.activeServerConnections }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.listeningTunnels') }}</span>
        <strong>{{ tunnelCounts.listening }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.errorTunnels') }}</span>
        <strong>{{ tunnelCounts.error }}</strong>
      </article>
    </div>

    <div class="split-grid">
      <section class="section-card">
        <div class="section-head">
          <div>
            <h2>{{ t('dashboard.clientTunnels') }}</h2>
          </div>
        </div>

        <div class="scroll-area">
          <table class="table">
            <thead>
              <tr>
                <th>{{ t('dashboard.columnClient') }}</th>
                <th>{{ t('dashboard.columnTunnel') }}</th>
                <th>{{ t('dashboard.columnStatus') }}</th>
                <th>{{ t('dashboard.columnConnections') }}</th>
                <th>{{ t('dashboard.columnEndpoint') }}</th>
                <th>{{ t('dashboard.columnUpdated') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in runtime.tunnels" :key="item.key">
                <td>{{ item.client }}</td>
                <td>{{ item.tunnel }}</td>
                <td>
                  <span class="badge" :class="statusClass(item.state)">{{ item.state }}</span>
                  <div v-if="item.error" class="inline-error">{{ item.error }}</div>
                </td>
                <td>{{ item.active_connections }}</td>
                <td>{{ item.endpoint || '—' }}</td>
                <td>{{ formatTimeAgo(item.updated_at) }}</td>
              </tr>
              <tr v-if="!runtime.tunnels.length">
                <td colspan="6" class="empty-cell">{{ t('dashboard.emptyTunnels') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-card">
        <div class="section-head">
          <div>
            <h2>{{ t('dashboard.recentEvents') }}</h2>
          </div>
        </div>

        <div class="scroll-area">
          <div class="event-list">
            <article
              v-for="event in runtime.recentEvents"
              :key="`${event.topic}-${event.time}`"
              class="event-row"
            >
              <div>
                <div>{{ describeEvent(event.topic) }}</div>
                <div class="muted">{{ eventDetail(event.topic, event.data) || event.topic }}</div>
              </div>
              <div class="event-meta">
                <span class="event-time">{{ formatLocalTime(event.time) }}</span>
                <span class="event-ago muted">{{ formatTimeAgo(event.time) }}</span>
              </div>
            </article>
            <div v-if="!runtime.recentEvents.length" class="empty-state">
              {{ t('dashboard.emptyEvents') }}
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.event-time {
  margin-right: 0.5em;
}
.section-head {
  margin-bottom: 1em;
}

/* 整页随父 .content-panel 伸缩: 顶栏 + 6 个 stat 卡片占自然高度,
 * 第二行 split-grid 吃掉剩余空间; 内部 scroll-area 滚动.
 *
 * 上层链路: .shell (grid, minmax(0,1fr) 中间行) -> .shell-main (flex col) ->
 * .content-panel (flex:1 col) -> .dashboard-page (flex:1 col), 全靠 flex
 * 传递高度, 不依赖 vh / magic 偏移. */
.dashboard-page {
  flex: 1 1 auto;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dashboard-page > .stat-grid,
.dashboard-page > .page-toolbar {
  flex: 0 0 auto;
}

.dashboard-page > .split-grid {
  flex: 1 1 auto;
  min-height: 300px;
  /* grid 子项默认 min-height: auto, 会撑出滚动条; 强制 0 让内部接管 */
  align-items: stretch;
}

.dashboard-page > .split-grid > :deep(.section-card) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.dashboard-page :deep(.scroll-area) {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

/* 事件列表整体降一档字号, 以及收紧行间距 — 标题 0.85rem, 副标题 / 时间
 * 0.75rem, 让一屏能容纳更多条事件. 水平 padding 保留 (原 1rem) 否则文本
 * 会贴到 row 的 border. */
.dashboard-page :deep(.event-list) {
  gap: 0.5rem;
}
.dashboard-page :deep(.event-row) {
  font-size: 0.8rem;
  padding: 0.5rem 0.85rem;
  gap: 0.5rem;
}
.dashboard-page :deep(.event-row strong) {
  font-size: 0.85rem;
  font-weight: 600;
}
.dashboard-page :deep(.event-row .muted) {
  font-size: 0.75rem;
}
.dashboard-page :deep(.event-meta) {
  font-size: 0.75rem;
}
</style>
