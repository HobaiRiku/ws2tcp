<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRuntimeStore } from '@/stores/runtime'
import { formatBytes, formatDuration, formatTimeAgo } from '@/utils/format'

const runtime = useRuntimeStore()

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
  if (topic === 'tunnel.state') return 'Tunnel state changed'
  if (topic === 'server.conn.opened') return 'Server connection opened'
  if (topic === 'server.conn.closed') return 'Server connection closed'
  return topic
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <div class="page-kicker">Overview</div>
        <h1>Live tunnel health and activity</h1>
        <p class="page-copy">
          Watch the current runtime, recent tunnel state changes, and which server identities are
          actively carrying connections.
        </p>
      </div>
      <fluent-button appearance="stealth" @click="runtime.refresh()">Refresh</fluent-button>
    </div>

    <div class="stat-grid">
      <article class="stat-card">
        <span class="stat-label">Uptime</span>
        <strong>{{ formatDuration(runtime.serverStats?.uptime_seconds ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Transferred in</span>
        <strong>{{ formatBytes(runtime.serverStats?.bytes_in ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Transferred out</span>
        <strong>{{ formatBytes(runtime.serverStats?.bytes_out ?? 0) }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Server live connections</span>
        <strong>{{ runtime.activeServerConnections }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Listening tunnels</span>
        <strong>{{ tunnelCounts.listening }}</strong>
      </article>
      <article class="stat-card">
        <span class="stat-label">Tunnel errors</span>
        <strong>{{ tunnelCounts.error }}</strong>
      </article>
    </div>

    <div class="split-grid">
      <section class="section-card">
        <div class="section-head">
          <div>
            <h2>Client tunnels</h2>
            <p>Runtime status for each configured client tunnel.</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Tunnel</th>
              <th>Status</th>
              <th>Connections</th>
              <th>Endpoint</th>
              <th>Updated</th>
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
              <td colspan="6" class="empty-cell">No client tunnels are reporting runtime state yet.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section-card">
        <div class="section-head">
          <div>
            <h2>Recent events</h2>
            <p>Live updates streamed from the management event bus.</p>
          </div>
        </div>

        <div class="event-list">
          <article v-for="event in runtime.recentEvents" :key="`${event.topic}-${event.time}`" class="event-row">
            <div>
              <strong>{{ describeEvent(event.topic) }}</strong>
              <div class="muted">{{ event.topic }}</div>
            </div>
            <div class="event-meta">
              <span>{{ formatTimeAgo(event.time) }}</span>
            </div>
          </article>
          <div v-if="!runtime.recentEvents.length" class="empty-state">
            Waiting for new tunnel and server connection events.
          </div>
        </div>
      </section>
    </div>
  </section>
</template>
