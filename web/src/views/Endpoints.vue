<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { Endpoint } from '@/api/types'

const list = ref<Endpoint[]>([])
const error = ref('')

async function load() {
  const [err, data] = await api.get<Endpoint[]>('/api/client/endpoints')
  if (err) {
    error.value = err.message
    return
  }
  list.value = data ?? []
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar"><h2>Endpoints</h2></div>
    <div v-if="error" class="banner error">{{ error }}</div>
    <div class="card">
      <table class="data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Host</th>
            <th>IP override</th>
            <th>Port</th>
            <th>Path</th>
            <th>Scheme</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ep in list" :key="ep.name">
            <td>{{ ep.name }}</td>
            <td>{{ ep.host }}</td>
            <td>{{ ep.ip || '—' }}</td>
            <td>{{ ep.port }}</td>
            <td>{{ ep.path }}</td>
            <td>{{ ep.wss ? 'wss' : 'ws' }}</td>
          </tr>
          <tr v-if="!list.length">
            <td colspan="6" style="color: var(--text-muted); text-align: center">
              No endpoints configured
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
