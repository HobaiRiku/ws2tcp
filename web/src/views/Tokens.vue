<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { Token } from '@/api/types'

const list = ref<Token[]>([])
const error = ref('')
const issued = ref<{ name: string; token: string } | null>(null)

const newName = ref('')
const newScopes = ref<string[]>(['read'])
const allScopes = ['read', 'client:write', 'server:write', 'admin']

async function load() {
  const [err, data] = await api.get<Token[]>('/api/auth/tokens')
  if (err) {
    error.value = err.message
    return
  }
  list.value = data ?? []
}

async function issue() {
  if (!newName.value) return
  const [err, data] = await api.post<{ name: string; token: string }>('/api/auth/tokens', {
    name: newName.value,
    scopes: newScopes.value
  })
  if (err) {
    error.value = err.message
    return
  }
  issued.value = data
  newName.value = ''
  await load()
}

async function revoke(name: string) {
  if (!confirm(`Revoke token "${name}"?`)) return
  const [err] = await api.delete(`/api/auth/tokens/${encodeURIComponent(name)}`)
  if (err) {
    error.value = err.message
    return
  }
  await load()
}

function toggleScope(s: string) {
  newScopes.value = newScopes.value.includes(s)
    ? newScopes.value.filter(x => x !== s)
    : [...newScopes.value, s]
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar"><h2>API tokens</h2></div>
    <div v-if="error" class="banner error">{{ error }}</div>

    <div v-if="issued" class="banner ok">
      Token <code>{{ issued.name }}</code> issued. Copy now — it will not be shown again:<br />
      <code style="user-select: all">{{ issued.token }}</code>
      <fluent-button
        appearance="stealth"
        @click="issued = null"
        style="float: right; width: auto"
        >Dismiss</fluent-button
      >
    </div>

    <div class="card">
      <h2>Issue token</h2>
      <fluent-text-field
        :value="newName"
        @input="(e: Event) => (newName = (e.target as HTMLInputElement).value)"
        placeholder="cli-prod"
      >
        Name
      </fluent-text-field>
      <div style="margin: 0.75rem 0; display: flex; flex-wrap: wrap; gap: 0.5rem">
        <fluent-checkbox
          v-for="s in allScopes"
          :key="s"
          :checked="newScopes.includes(s)"
          @change="toggleScope(s)"
        >
          {{ s }}
        </fluent-checkbox>
      </div>
      <fluent-button appearance="accent" @click="issue">Issue</fluent-button>
    </div>

    <div class="card">
      <table class="data">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scopes</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in list" :key="t.name">
            <td>{{ t.name }}</td>
            <td>
              <span v-for="s in t.scopes" :key="s" class="tag">{{ s }}</span>
            </td>
            <td>{{ t.created_at }}</td>
            <td class="row-actions">
              <fluent-button appearance="stealth" @click="revoke(t.name)">Revoke</fluent-button>
            </td>
          </tr>
          <tr v-if="!list.length">
            <td colspan="4" style="color: var(--text-muted); text-align: center">No tokens</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
