<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { Endpoint } from '@/api/types'
import { eventChecked } from '@/utils/forms'

type EndpointForm = Endpoint & {
  ip: string
  aes_key: string
  ssl_reject_unauthorized: boolean
}

const list = ref<Endpoint[]>([])
const selectedName = ref('')
const error = ref('')
const success = ref('')
const busy = ref(false)
const form = ref(emptyForm())
const hiddenInvalidCount = ref(0)

const editingExisting = computed(() => selectedName.value !== '')

function emptyForm(): EndpointForm {
  return {
    name: '',
    host: '',
    ip: '',
    port: 443,
    path: '/connect',
    wss: true,
    aes_key: '',
    ssl_reject_unauthorized: true
  }
}

function applySelection(name: string) {
  selectedName.value = name
  const endpoint = list.value.find(item => item.name === name)
  if (!endpoint) {
    form.value = emptyForm()
    return
  }
  form.value = {
    name: endpoint.name,
    host: endpoint.host,
    ip: endpoint.ip ?? '',
    port: endpoint.port,
    path: endpoint.path,
    wss: endpoint.wss,
    aes_key: '',
    ssl_reject_unauthorized: endpoint.ssl_reject_unauthorized ?? false
  }
}

async function load(preferred = selectedName.value) {
  const [err, data] = await api.get<Endpoint[]>('/api/client/endpoints')
  if (err) {
    error.value = err.message
    return
  }
  const next = (data ?? []).filter(item => item.name?.trim())
  hiddenInvalidCount.value = (data?.length ?? 0) - next.length
  list.value = next
  if (preferred && list.value.some(item => item.name === preferred)) {
    applySelection(preferred)
    return
  }
  if (list.value[0]) {
    applySelection(list.value[0].name)
    return
  }
  selectedName.value = ''
  form.value = emptyForm()
}

function startCreate() {
  error.value = ''
  success.value = ''
  selectedName.value = ''
  form.value = emptyForm()
}

async function save() {
  error.value = ''
  success.value = ''
  busy.value = true

  if (!editingExisting.value && form.value.aes_key.trim().length !== 32) {
    busy.value = false
    error.value = 'A new endpoint needs a 32-byte AES key.'
    return
  }

  if (editingExisting.value) {
    const payload: Record<string, unknown> = {
      host: form.value.host,
      ip: form.value.ip,
      port: form.value.port,
      path: form.value.path,
      wss: form.value.wss,
      ssl_reject_unauthorized: form.value.ssl_reject_unauthorized
    }
    if (form.value.aes_key.trim()) {
      payload.aes_key = form.value.aes_key.trim()
    }
    const [err] = await api.patch(`/api/client/endpoints/${encodeURIComponent(selectedName.value)}`, payload)
    busy.value = false
    if (err) {
      error.value = err.message
      return
    }
    success.value = `Endpoint "${selectedName.value}" updated.`
    await load(selectedName.value)
    return
  }

  const [err] = await api.post('/api/client/endpoints', {
    ...form.value,
    aes_key: form.value.aes_key.trim()
  })
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Endpoint "${form.value.name}" created.`
  await load(form.value.name)
}

async function removeEndpoint() {
  if (!selectedName.value) return
  if (!confirm(`Delete endpoint "${selectedName.value}"?`)) return
  error.value = ''
  success.value = ''
  const [err] = await api.delete(`/api/client/endpoints/${encodeURIComponent(selectedName.value)}`)
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Endpoint "${selectedName.value}" deleted.`
  selectedName.value = ''
  form.value = emptyForm()
  await load('')
}

onMounted(() => {
  load()
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <div class="page-kicker">Endpoints</div>
        <h1>Reusable upstream connection profiles</h1>
        <p class="page-copy">
          Create, update, and retire the shared server endpoints that client profiles attach to.
        </p>
      </div>
      <fluent-button appearance="accent" @click="startCreate">New endpoint</fluent-button>
    </div>

    <div v-if="error" class="banner error">{{ error }}</div>
    <div v-if="success" class="banner ok">{{ success }}</div>
    <div v-if="hiddenInvalidCount" class="banner error">
      Hidden {{ hiddenInvalidCount }} invalid endpoint entries with empty names. Fix them in config if needed.
    </div>

    <div class="workspace-grid">
      <aside class="section-card selection-list">
        <div class="section-head">
          <div>
            <h2>Configured endpoints</h2>
            <p>{{ list.length }} total</p>
          </div>
        </div>

        <button
          v-for="endpoint in list"
          :key="endpoint.name"
          class="selection-row"
          :class="{ active: endpoint.name === selectedName }"
          type="button"
          @click="applySelection(endpoint.name)"
        >
          <strong>{{ endpoint.name }}</strong>
          <span>{{ endpoint.host }}:{{ endpoint.port }}</span>
        </button>

        <div v-if="!list.length" class="empty-state">No endpoints configured yet.</div>
      </aside>

      <section class="section-card">
        <div class="section-head">
          <div>
            <h2>{{ editingExisting ? `Edit ${selectedName}` : 'Create endpoint' }}</h2>
            <p>
              {{
                editingExisting
                  ? 'Update the shared host, path, and TLS behaviour. Leave AES key blank to keep the current one.'
                  : 'New endpoints need a full server host, path, and AES key.'
              }}
            </p>
          </div>
        </div>

        <div class="form-grid two-up">
          <label>
            <span class="field-label">Name</span>
            <input v-model="form.name" class="text-input" :disabled="editingExisting" />
          </label>
          <label>
            <span class="field-label">Host / SNI name</span>
            <input v-model="form.host" class="text-input" />
          </label>
          <label>
            <span class="field-label">IP override</span>
            <input v-model="form.ip" class="text-input" />
          </label>
          <label>
            <span class="field-label">Port</span>
            <input v-model.number="form.port" class="text-input" type="number" />
          </label>
          <label>
            <span class="field-label">Path</span>
            <input v-model="form.path" class="text-input" />
          </label>
          <label>
            <span class="field-label">AES key</span>
            <input
              v-model="form.aes_key"
              class="text-input"
              type="password"
              :placeholder="editingExisting ? 'Leave blank to keep current key' : '32-byte AES key'"
            />
          </label>
        </div>

        <div class="checkbox-row fluent-switches">
          <fluent-switch :checked="form.wss" @change="form.wss = eventChecked($event)">Use WSS</fluent-switch>
          <fluent-switch
            :checked="form.ssl_reject_unauthorized"
            @change="form.ssl_reject_unauthorized = eventChecked($event)"
          >
            Verify server TLS certificate
          </fluent-switch>
        </div>

        <div class="form-actions">
          <fluent-button appearance="accent" :disabled="busy" @click="save">
            {{ busy ? 'Saving…' : editingExisting ? 'Save changes' : 'Create endpoint' }}
          </fluent-button>
          <fluent-button
            v-if="editingExisting"
            :disabled="busy"
            appearance="stealth"
            @click="removeEndpoint"
          >
            Delete endpoint
          </fluent-button>
        </div>
      </section>
    </div>
  </section>
</template>
