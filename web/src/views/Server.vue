<script setup lang="ts">
// Server role: identities (clients allowed to connect inbound) + ACL.
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ServerClient } from '@/api/types'

const list = ref<ServerClient[]>([])
const error = ref('')
const busy = ref(false)

const showForm = ref(false)
const newId = ref('')
const newSecret = ref('')

async function load() {
  const [err, data] = await api.get<ServerClient[]>('/api/server/clients')
  if (err) {
    error.value = err.message
    return
  }
  list.value = data ?? []
}

async function create() {
  if (!newId.value || !newSecret.value) return
  busy.value = true
  const [err] = await api.post('/api/server/clients', {
    id: newId.value,
    secret: newSecret.value,
    acl: []
  })
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  newId.value = ''
  newSecret.value = ''
  showForm.value = false
  await load()
}

async function remove(id: string) {
  if (!confirm(`Delete client "${id}"?`)) return
  const [err] = await api.delete(`/api/server/clients/${encodeURIComponent(id)}`)
  if (err) {
    error.value = err.message
    return
  }
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar">
      <h2>Server clients</h2>
      <fluent-button appearance="accent" @click="showForm = !showForm">
        {{ showForm ? 'Cancel' : 'New client' }}
      </fluent-button>
    </div>

    <div v-if="error" class="banner error">{{ error }}</div>

    <div v-if="showForm" class="card">
      <h2>New client</h2>
      <fluent-text-field
        :value="newId"
        @input="(e: Event) => (newId = (e.target as HTMLInputElement).value)"
        placeholder="client id"
      >
        Client ID
      </fluent-text-field>
      <div style="height: 0.5rem" />
      <fluent-text-field
        type="password"
        :value="newSecret"
        @input="(e: Event) => (newSecret = (e.target as HTMLInputElement).value)"
        placeholder="shared secret"
      >
        Secret
      </fluent-text-field>
      <div style="height: 0.75rem" />
      <fluent-button appearance="accent" :disabled="busy" @click="create">Create</fluent-button>
    </div>

    <div class="card">
      <table class="data">
        <thead>
          <tr>
            <th>ID</th>
            <th>ACL rules</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in list" :key="c.id">
            <td>{{ c.id }}</td>
            <td>
              <span v-if="!c.acl.length" style="color: var(--text-muted)">none</span>
              <span v-for="(rule, i) in c.acl" :key="i" class="tag">
                {{ rule.cidr }} → {{ rule.ports.join(',') || '*' }}
              </span>
            </td>
            <td class="row-actions">
              <fluent-button appearance="stealth" @click="remove(c.id)">Delete</fluent-button>
            </td>
          </tr>
          <tr v-if="!list.length">
            <td colspan="3" style="color: var(--text-muted); text-align: center">
              No clients configured
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
