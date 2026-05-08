<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRuntimeStore } from '@/stores/runtime'
import { formatBytes, formatDuration, formatTimeAgo } from '@/utils/format'
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

function describeEvent(topic: string) {
  if (topic === 'tunnel.state') return t('dashboard.eventTunnelState')
  if (topic === 'server.conn.opened') return t('dashboard.eventConnOpened')
  if (topic === 'server.conn.closed') return t('dashboard.eventConnClosed')
  return topic
}
</script>

<template>
  <section class="page">
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
        <span class="stat-label">{{ t('dashboard.bytesIn') }}</span>
        <strong>{{ formatBytes(runtime.serverStats?.bytes_in ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">{{ t('dashboard.bytesOut') }}</span>
        <strong>{{ formatBytes(runtime.serverStats?.bytes_out ?? 0) }}</strong>
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
      </section>

      <section class="section-card">
        <div class="section-head">
          <div>
            <h2>{{ t('dashboard.recentEvents') }}</h2>
          </div>
        </div>

        <div class="event-list">
          <article
            v-for="event in runtime.recentEvents"
            :key="`${event.topic}-${event.time}`"
            class="event-row"
          >
            <div>
              <strong>{{ describeEvent(event.topic) }}</strong>
              <div class="muted">{{ event.topic }}</div>
            </div>
            <div class="event-meta">
              <span>{{ formatTimeAgo(event.time) }}</span>
            </div>
          </article>
          <div v-if="!runtime.recentEvents.length" class="empty-state">
            {{ t('dashboard.emptyEvents') }}
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
