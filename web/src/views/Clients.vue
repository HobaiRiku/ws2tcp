<script setup lang="ts">
// Client role: profiles (each profile bundles credentials + endpoint + tunnels).
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ClientProfile, Tunnel } from '@/api/types'

const profiles = ref<ClientProfile[]>([])
const error = ref('')
const expanded = ref<Record<string, Tunnel[]>>({})

async function load() {
  const [err, data] = await api.get<ClientProfile[]>('/api/client/profiles')
  if (err) {
    error.value = err.message
    return
  }
  profiles.value = data ?? []
}

async function loadTunnels(name: string) {
  const [err, data] = await api.get<Tunnel[]>(`/api/client/${encodeURIComponent(name)}/tunnels`)
  if (err) {
    error.value = err.message
    return
  }
  expanded.value = { ...expanded.value, [name]: data ?? [] }
}

async function deleteTunnel(client: string, tunnel: string) {
  if (!confirm(`Delete tunnel "${tunnel}" from "${client}"?`)) return
  const [err] = await api.delete(
    `/api/client/${encodeURIComponent(client)}/tunnels/${encodeURIComponent(tunnel)}`
  )
  if (err) {
    error.value = err.message
    return
  }
  await loadTunnels(client)
}

const newTunnel = ref<Record<string, Tunnel>>({})
function emptyTunnel(): Tunnel {
  return { name: '', listen: '127.0.0.1:0', target_host: '', target_port: 22 }
}

async function addTunnel(client: string) {
  const t = newTunnel.value[client]
  if (!t || !t.name || !t.target_host) return
  const [err] = await api.post(`/api/client/${encodeURIComponent(client)}/tunnels`, t)
  if (err) {
    error.value = err.message
    return
  }
  newTunnel.value[client] = emptyTunnel()
  await loadTunnels(client)
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar"><h2>Client profiles</h2></div>
    <div v-if="error" class="banner error">{{ error }}</div>

    <div v-for="p in profiles" :key="p.name" class="card">
      <div class="toolbar">
        <h2>
          {{ p.name }}
          <span class="tag">id: {{ p.client_id }}</span>
          <span class="tag">endpoint: {{ p.endpoint }}</span>
        </h2>
        <fluent-button
          appearance="stealth"
          @click="
            () => {
              loadTunnels(p.name)
              if (!newTunnel[p.name]) newTunnel[p.name] = emptyTunnel()
            }
          "
        >
          Refresh tunnels
        </fluent-button>
      </div>

      <table class="data" v-if="expanded[p.name]">
        <thead>
          <tr>
            <th>Name</th>
            <th>Listen</th>
            <th>Target</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in expanded[p.name]" :key="t.name">
            <td>{{ t.name }}</td>
            <td>{{ t.listen }}</td>
            <td>{{ t.target_host }}:{{ t.target_port }}</td>
            <td class="row-actions">
              <fluent-button appearance="stealth" @click="deleteTunnel(p.name, t.name)">
                Delete
              </fluent-button>
            </td>
          </tr>
          <tr v-if="!expanded[p.name].length">
            <td colspan="4" style="color: var(--text-muted); text-align: center">No tunnels</td>
          </tr>
        </tbody>
      </table>

      <div v-if="newTunnel[p.name]" style="margin-top: 0.75rem; display: grid; gap: 0.4rem">
        <strong style="font-size: 0.85rem">Add tunnel</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 100px auto; gap: 0.4rem">
          <fluent-text-field
            :value="newTunnel[p.name].name"
            @input="(e: Event) => (newTunnel[p.name].name = (e.target as HTMLInputElement).value)"
            placeholder="ssh"
            >name</fluent-text-field
          >
          <fluent-text-field
            :value="newTunnel[p.name].listen"
            @input="(e: Event) => (newTunnel[p.name].listen = (e.target as HTMLInputElement).value)"
            placeholder="127.0.0.1:2222"
            >listen</fluent-text-field
          >
          <fluent-text-field
            :value="newTunnel[p.name].target_host"
            @input="
              (e: Event) => (newTunnel[p.name].target_host = (e.target as HTMLInputElement).value)
            "
            placeholder="10.0.0.5"
            >target host</fluent-text-field
          >
          <fluent-text-field
            type="number"
            :value="String(newTunnel[p.name].target_port)"
            @input="
              (e: Event) =>
                (newTunnel[p.name].target_port = Number((e.target as HTMLInputElement).value))
            "
            >target port</fluent-text-field
          >
          <fluent-button appearance="accent" @click="addTunnel(p.name)">Add</fluent-button>
        </div>
      </div>
    </div>

    <div v-if="!profiles.length" class="card" style="text-align: center; color: var(--text-muted)">
      No client profiles configured
    </div>
  </div>
</template>
