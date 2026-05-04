<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ACLRule, ServerClient } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'

const runtime = useRuntimeStore()
const list = ref<ServerClient[]>([])
const error = ref('')
const success = ref('')
const drafts = ref<Record<string, { secret: string; aclText: string }>>({})
const newClient = ref({ id: '', secret: '', aclText: '' })
const busy = ref(false)

function aclToText(acl: ACLRule[]) {
  return acl.map(rule => `${rule.cidr} ${rule.ports.join(',') || '*'}`).join('\n')
}

function parseACL(text: string): ACLRule[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [cidr, portsRaw = '*'] = line.split(/\s+/, 2)
      const ports = portsRaw === '*' ? [] : portsRaw.split(',').map(part => part.trim()).filter(Boolean)
      return { cidr, ports }
    })
}

function syncDrafts() {
  const next: Record<string, { secret: string; aclText: string }> = {}
  for (const item of list.value) {
    next[item.id] = {
      secret: '',
      aclText: aclToText(item.acl)
    }
  }
  drafts.value = next
}

async function load() {
  const [err, data] = await api.get<ServerClient[]>('/api/server/clients')
  if (err) {
    error.value = err.message
    return
  }
  list.value = data ?? []
  syncDrafts()
}

async function createClient() {
  error.value = ''
  success.value = ''
  busy.value = true
  const [err] = await api.post('/api/server/clients', {
    id: newClient.value.id,
    secret: newClient.value.secret,
    acl: parseACL(newClient.value.aclText)
  })
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Server client "${newClient.value.id}" created.`
  newClient.value = { id: '', secret: '', aclText: '' }
  await load()
}

async function saveClient(client: ServerClient) {
  const draft = drafts.value[client.id]
  if (!draft) return
  error.value = ''
  success.value = ''
  busy.value = true
  const payload: Record<string, unknown> = {
    acl: parseACL(draft.aclText)
  }
  if (draft.secret.trim()) {
    payload.secret = draft.secret.trim()
  }
  const [err] = await api.patch(`/api/server/clients/${encodeURIComponent(client.id)}`, payload)
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Server client "${client.id}" updated.`
  await load()
}

async function removeClient(id: string) {
  if (!confirm(`Delete server client "${id}"?`)) return
  error.value = ''
  success.value = ''
  const [err] = await api.delete(`/api/server/clients/${encodeURIComponent(id)}`)
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Server client "${id}" deleted.`
  await load()
}

function connectionCount(id: string) {
  return runtime.serverStats?.client_connections?.[id] ?? 0
}

function statusClass(id: string) {
  return connectionCount(id) > 0 ? 'badge-ok' : 'badge-neutral'
}

const totalConnections = computed(() => runtime.activeServerConnections)

onMounted(() => {
  runtime.refresh()
  load()
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <div class="page-kicker">Server identities</div>
        <h1>Manage inbound client credentials and ACLs</h1>
        <p class="page-copy">
          Rotate secrets, edit access rules, and see which identities currently have live server
          connections.
        </p>
      </div>
      <span class="badge badge-info">{{ totalConnections }} live connections</span>
    </div>

    <div v-if="error" class="banner error">{{ error }}</div>
    <div v-if="success" class="banner ok">{{ success }}</div>

    <section class="section-card">
      <div class="section-head">
        <div>
          <h2>Create server client</h2>
          <p>Each entry is one allowed inbound client identity.</p>
        </div>
      </div>
      <div class="form-grid three-up">
        <label>
          <span class="field-label">Client ID</span>
          <input v-model="newClient.id" class="text-input" placeholder="branch-office" />
        </label>
        <label>
          <span class="field-label">Shared secret</span>
          <input v-model="newClient.secret" class="text-input" type="password" placeholder="shared secret" />
        </label>
        <label class="form-span-full">
          <span class="field-label">ACL rules</span>
          <textarea
            v-model="newClient.aclText"
            class="text-area"
            rows="3"
            placeholder="192.168.1.0/24 22,80&#10;10.0.0.0/8 3306"
          />
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="button" :disabled="busy" @click="createClient">
          {{ busy ? 'Saving…' : 'Create server client' }}
        </button>
      </div>
    </section>

    <div class="stack">
      <section v-for="client in list" :key="client.id" class="section-card">
        <div class="section-head">
          <div>
            <h2>{{ client.id }}</h2>
            <p>
              <span class="badge" :class="statusClass(client.id)">
                {{ connectionCount(client.id) > 0 ? 'active' : 'idle' }}
              </span>
              {{ connectionCount(client.id) }} live connections
            </p>
          </div>
          <button class="button button-danger" type="button" @click="removeClient(client.id)">
            Delete
          </button>
        </div>

        <div class="form-grid two-up">
          <label>
            <span class="field-label">Rotate secret</span>
            <input
              v-model="drafts[client.id].secret"
              class="text-input"
              type="password"
              placeholder="Leave blank to keep current secret"
            />
          </label>
          <label class="form-span-full">
            <span class="field-label">ACL rules</span>
            <textarea v-model="drafts[client.id].aclText" class="text-area" rows="4" />
          </label>
        </div>

        <div class="form-actions">
          <button class="button button-primary" type="button" :disabled="busy" @click="saveClient(client)">
            Save changes
          </button>
        </div>
      </section>

      <div v-if="!list.length" class="empty-state">No server client identities are configured.</div>
    </div>
  </section>
</template>
