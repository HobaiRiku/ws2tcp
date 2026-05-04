<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ACLRule, ServerClient, ServerSettings } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'
import { eventChecked } from '@/utils/forms'

const runtime = useRuntimeStore()
const list = ref<ServerClient[]>([])
const error = ref('')
const success = ref('')
const drafts = ref<Record<string, { secret: string; aclText: string }>>({})
const newClient = ref({ id: '', secret: '', aclText: '' })
const busy = ref(false)
const settings = ref<ServerSettings | null>(null)

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

  const [settingsErr, settingsData] = await api.get<ServerSettings>('/api/server/settings')
  if (!settingsErr && settingsData) {
    settings.value = settingsData
  }
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

async function saveServerSettings() {
  if (!settings.value) return
  error.value = ''
  success.value = ''
  const [err] = await api.patch('/api/server/settings', {
    use_encryption: settings.value.use_encryption
  })
  if (err) {
    error.value = err.message
    return
  }
  success.value = 'Server settings updated.'
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

    <section v-if="settings" class="section-card">
      <div class="section-head">
        <div>
          <h2>Server transport settings</h2>
          <p>Visibility for core server transport behaviour, including data-plane encryption.</p>
        </div>
      </div>
      <div class="server-settings-grid">
        <div class="settings-summary">
          <div><span class="field-label">Listen</span><strong>{{ settings.listen }}</strong></div>
          <div><span class="field-label">WS path</span><strong>{{ settings.ws_path }}</strong></div>
          <div><span class="field-label">WS host</span><strong>{{ settings.ws_host || 'disabled' }}</strong></div>
          <div><span class="field-label">TLS</span><strong>{{ settings.tls_enabled ? 'enabled' : 'disabled' }}</strong></div>
        </div>
        <div class="checkbox-row fluent-switches">
          <fluent-switch
            :checked="settings.use_encryption"
            @change="settings.use_encryption = eventChecked($event)"
          >
            Data-plane end-to-end encryption
          </fluent-switch>
          <fluent-switch :checked="settings.trust_proxy" disabled>Trust proxy headers</fluent-switch>
        </div>
        <div class="form-actions">
          <fluent-button appearance="accent" @click="saveServerSettings">Save server settings</fluent-button>
        </div>
      </div>
    </section>

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
          <input v-model="newClient.id" class="text-input" />
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
        <fluent-button appearance="accent" :disabled="busy" @click="createClient">
          {{ busy ? 'Saving…' : 'Create server client' }}
        </fluent-button>
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
          <fluent-button appearance="stealth" @click="removeClient(client.id)">
            Delete
          </fluent-button>
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
          <fluent-button appearance="accent" :disabled="busy" @click="saveClient(client)">
            Save changes
          </fluent-button>
        </div>
      </section>

      <div v-if="!list.length" class="empty-state">No server client identities are configured.</div>
    </div>
  </section>
</template>
