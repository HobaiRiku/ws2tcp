<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ServerStats } from '@/api/types'
import { formatBytes, formatDuration } from '@/utils/format'

const stats = ref<ServerStats | null>(null)
const error = ref('')

async function load() {
  const [err, data] = await api.get<ServerStats>('/api/server/stats')
  if (err) {
    error.value = err.message
    return
  }
  stats.value = data
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  load()
  timer = setInterval(load, 5000)
})

import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div>
    <div class="toolbar"><h2>Dashboard</h2></div>
    <div v-if="error" class="banner error">{{ error }}</div>

    <div class="card" v-if="stats">
      <h2>Server runtime</h2>
      <dl class="kvgrid">
        <dt>Uptime</dt>
        <dd>{{ formatDuration(stats.uptime_seconds) }}</dd>
        <dt>Bytes in</dt>
        <dd>{{ formatBytes(stats.bytes_in) }}</dd>
        <dt>Bytes out</dt>
        <dd>{{ formatBytes(stats.bytes_out) }}</dd>
        <dt>Active client connections</dt>
        <dd>
          <span v-if="!Object.keys(stats.client_connections).length">—</span>
          <span
            v-for="(n, id) in stats.client_connections"
            :key="id"
            class="tag"
            style="font-size: 0.78rem"
          >
            {{ id }}: {{ n }}
          </span>
        </dd>
      </dl>
    </div>
  </div>
</template>
