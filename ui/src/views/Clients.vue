<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ClientProfile, Endpoint, Tunnel } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'

const runtime = useRuntimeStore()
const profiles = ref<ClientProfile[]>([])
const endpoints = ref<Endpoint[]>([])
const error = ref('')
const success = ref('')
const busy = ref(false)

const profileDrafts = ref<Record<string, { endpoint: string; client_id: string; client_secret: string }>>({})
const tunnelDrafts = ref<Record<string, Record<string, Tunnel>>>({})
const newTunnels = ref<Record<string, Tunnel>>({})
const newProfile = ref({
  name: '',
  endpoint: '',
  client_id: '',
  client_secret: ''
})

function emptyTunnel(): Tunnel {
  return { name: '', listen: '127.0.0.1:0', target_host: '', target_port: 22 }
}

function syncDrafts() {
  const nextProfiles: Record<string, { endpoint: string; client_id: string; client_secret: string }> = {}
  const nextTunnels: Record<string, Record<string, Tunnel>> = {}
  const nextNewTunnels: Record<string, Tunnel> = {}

  for (const profile of profiles.value) {
    nextProfiles[profile.name] = {
      endpoint: profile.endpoint,
      client_id: profile.client_id,
      client_secret: ''
    }
    nextTunnels[profile.name] = {}
    for (const tunnel of profile.tunnels) {
      nextTunnels[profile.name][tunnel.name] = { ...tunnel }
    }
    nextNewTunnels[profile.name] = emptyTunnel()
  }

  profileDrafts.value = nextProfiles
  tunnelDrafts.value = nextTunnels
  newTunnels.value = nextNewTunnels

  if (!newProfile.value.endpoint && endpoints.value[0]) {
    newProfile.value.endpoint = endpoints.value[0].name
  }
}

async function load() {
  const [profilesErr, profileData] = await api.get<ClientProfile[]>('/api/client/profiles')
  if (profilesErr) {
    error.value = profilesErr.message
    return
  }
  const [endpointsErr, endpointData] = await api.get<Endpoint[]>('/api/client/endpoints')
  if (endpointsErr) {
    error.value = endpointsErr.message
    return
  }
  profiles.value = profileData ?? []
  endpoints.value = endpointData ?? []
  syncDrafts()
}

async function createProfile() {
  error.value = ''
  success.value = ''
  busy.value = true
  const [err] = await api.post('/api/client/profiles', {
    ...newProfile.value,
    tunnels: []
  })
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Client profile "${newProfile.value.name}" created.`
  newProfile.value = { name: '', endpoint: endpoints.value[0]?.name ?? '', client_id: '', client_secret: '' }
  await load()
}

async function saveProfile(profile: ClientProfile) {
  const draft = profileDrafts.value[profile.name]
  if (!draft) return
  error.value = ''
  success.value = ''
  const payload: Record<string, unknown> = {}
  if (draft.endpoint !== profile.endpoint) payload.endpoint = draft.endpoint
  if (draft.client_id !== profile.client_id) payload.client_id = draft.client_id
  if (draft.client_secret.trim()) payload.client_secret = draft.client_secret.trim()
  if (!Object.keys(payload).length) {
    success.value = `Nothing changed for "${profile.name}".`
    return
  }
  busy.value = true
  const [err] = await api.patch(`/api/client/profiles/${encodeURIComponent(profile.name)}`, payload)
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Client profile "${profile.name}" updated.`
  await load()
}

async function removeProfile(name: string) {
  if (!confirm(`Delete client profile "${name}" and all its tunnels?`)) return
  error.value = ''
  success.value = ''
  const [err] = await api.delete(`/api/client/profiles/${encodeURIComponent(name)}`)
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Client profile "${name}" deleted.`
  await load()
}

async function createTunnel(client: string) {
  const tunnel = newTunnels.value[client]
  if (!tunnel) return
  error.value = ''
  success.value = ''
  busy.value = true
  const [err] = await api.post(`/api/client/${encodeURIComponent(client)}/tunnels`, tunnel)
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Tunnel "${tunnel.name}" created for "${client}".`
  await load()
}

async function saveTunnel(client: string, tunnel: Tunnel) {
  const draft = tunnelDrafts.value[client]?.[tunnel.name]
  if (!draft) return
  error.value = ''
  success.value = ''
  const payload: Record<string, unknown> = {}
  if (draft.listen !== tunnel.listen) payload.listen = draft.listen
  if (draft.target_host !== tunnel.target_host) payload.target_host = draft.target_host
  if (draft.target_port !== tunnel.target_port) payload.target_port = draft.target_port
  if (!Object.keys(payload).length) {
    success.value = `Nothing changed for tunnel "${tunnel.name}".`
    return
  }
  busy.value = true
  const [err] = await api.patch(
    `/api/client/${encodeURIComponent(client)}/tunnels/${encodeURIComponent(tunnel.name)}`,
    payload
  )
  busy.value = false
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Tunnel "${tunnel.name}" updated.`
  await load()
}

async function removeTunnel(client: string, tunnel: string) {
  if (!confirm(`Delete tunnel "${tunnel}" from "${client}"?`)) return
  error.value = ''
  success.value = ''
  const [err] = await api.delete(
    `/api/client/${encodeURIComponent(client)}/tunnels/${encodeURIComponent(tunnel)}`
  )
  if (err) {
    error.value = err.message
    return
  }
  success.value = `Tunnel "${tunnel}" deleted.`
  await load()
}

function tunnelStateClass(client: string, tunnel: string) {
  const state = runtime.tunnelStatus(client, tunnel)?.state
  if (state === 'error') return 'badge-error'
  if (state === 'listening') return 'badge-ok'
  if (state === 'starting') return 'badge-info'
  return 'badge-neutral'
}

onMounted(() => {
  runtime.refresh()
  load()
})
</script>

<template>
  <section class="page">
    <div class="page-header">
      <div>
        <div class="page-kicker">Clients</div>
        <h1>Profiles, credentials, and tunnel CRUD</h1>
        <p class="page-copy">
          Manage reusable client profiles, point them at endpoints, and watch each tunnel's live
          state and connection count.
        </p>
      </div>
      <button class="button button-ghost" type="button" @click="load">Refresh</button>
    </div>

    <div v-if="error" class="banner error">{{ error }}</div>
    <div v-if="success" class="banner ok">{{ success }}</div>

    <section class="section-card">
      <div class="section-head">
        <div>
          <h2>Create client profile</h2>
          <p>A profile binds one endpoint, one handshake identity, and many tunnels.</p>
        </div>
      </div>
      <div class="form-grid four-up">
        <label>
          <span class="field-label">Profile name</span>
          <input v-model="newProfile.name" class="text-input" placeholder="branch-office" />
        </label>
        <label>
          <span class="field-label">Endpoint</span>
          <select v-model="newProfile.endpoint" class="select-input">
            <option disabled value="">Select endpoint</option>
            <option v-for="endpoint in endpoints" :key="endpoint.name" :value="endpoint.name">
              {{ endpoint.name }}
            </option>
          </select>
        </label>
        <label>
          <span class="field-label">Client ID</span>
          <input v-model="newProfile.client_id" class="text-input" />
        </label>
        <label>
          <span class="field-label">Client secret</span>
          <input v-model="newProfile.client_secret" class="text-input" type="password" />
        </label>
      </div>
      <div class="form-actions">
        <button class="button button-primary" type="button" :disabled="busy" @click="createProfile">
          {{ busy ? 'Saving…' : 'Create profile' }}
        </button>
      </div>
    </section>

    <div class="stack">
      <section v-for="profile in profiles" :key="profile.name" class="section-card">
        <div class="section-head">
          <div>
            <h2>{{ profile.name }}</h2>
            <p>{{ profile.tunnels.length }} tunnels · endpoint {{ profile.endpoint }}</p>
          </div>
          <button class="button button-danger" type="button" @click="removeProfile(profile.name)">
            Delete profile
          </button>
        </div>

        <div class="form-grid three-up">
          <label>
            <span class="field-label">Endpoint</span>
            <select v-model="profileDrafts[profile.name].endpoint" class="select-input">
              <option v-for="endpoint in endpoints" :key="endpoint.name" :value="endpoint.name">
                {{ endpoint.name }}
              </option>
            </select>
          </label>
          <label>
            <span class="field-label">Client ID</span>
            <input v-model="profileDrafts[profile.name].client_id" class="text-input" />
          </label>
          <label>
            <span class="field-label">Rotate secret</span>
            <input
              v-model="profileDrafts[profile.name].client_secret"
              class="text-input"
              type="password"
              placeholder="Leave blank to keep current secret"
            />
          </label>
        </div>

        <div class="form-actions">
          <button class="button button-primary" type="button" :disabled="busy" @click="saveProfile(profile)">
            Save profile
          </button>
        </div>

        <div class="section-head compact">
          <div>
            <h3>Tunnels</h3>
            <p>Each tunnel listens locally and forwards through this profile.</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Listen</th>
              <th>Target</th>
              <th>Status</th>
              <th>Connections</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tunnel in profile.tunnels" :key="tunnel.name">
              <td>{{ tunnel.name }}</td>
              <td>
                <input v-model="tunnelDrafts[profile.name][tunnel.name].listen" class="text-input compact-input" />
              </td>
              <td>
                <div class="inline-group">
                  <input
                    v-model="tunnelDrafts[profile.name][tunnel.name].target_host"
                    class="text-input compact-input"
                    placeholder="target host"
                  />
                  <input
                    v-model.number="tunnelDrafts[profile.name][tunnel.name].target_port"
                    class="text-input compact-input compact-port"
                    type="number"
                    min="1"
                    max="65535"
                  />
                </div>
              </td>
              <td>
                <span class="badge" :class="tunnelStateClass(profile.name, tunnel.name)">
                  {{ runtime.tunnelStatus(profile.name, tunnel.name)?.state ?? 'unknown' }}
                </span>
                <div v-if="runtime.tunnelStatus(profile.name, tunnel.name)?.error" class="inline-error">
                  {{ runtime.tunnelStatus(profile.name, tunnel.name)?.error }}
                </div>
              </td>
              <td>{{ runtime.tunnelStatus(profile.name, tunnel.name)?.active_connections ?? 0 }}</td>
              <td>
                <div class="row-actions">
                  <button class="button button-primary subtle" type="button" @click="saveTunnel(profile.name, tunnel)">
                    Save
                  </button>
                  <button class="button button-danger subtle" type="button" @click="removeTunnel(profile.name, tunnel.name)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!profile.tunnels.length">
              <td colspan="6" class="empty-cell">No tunnels configured for this profile.</td>
            </tr>
          </tbody>
        </table>

        <div class="nested-card">
          <h3>Add tunnel</h3>
          <div class="form-grid four-up">
            <label>
              <span class="field-label">Name</span>
              <input v-model="newTunnels[profile.name].name" class="text-input" />
            </label>
            <label>
              <span class="field-label">Listen</span>
              <input v-model="newTunnels[profile.name].listen" class="text-input" />
            </label>
            <label>
              <span class="field-label">Target host</span>
              <input v-model="newTunnels[profile.name].target_host" class="text-input" />
            </label>
            <label>
              <span class="field-label">Target port</span>
              <input
                v-model.number="newTunnels[profile.name].target_port"
                class="text-input"
                type="number"
                min="1"
                max="65535"
              />
            </label>
          </div>
          <div class="form-actions">
            <button class="button button-primary" type="button" :disabled="busy" @click="createTunnel(profile.name)">
              Add tunnel
            </button>
          </div>
        </div>
      </section>

      <div v-if="!profiles.length" class="empty-state">No client profiles configured yet.</div>
    </div>
  </section>
</template>
