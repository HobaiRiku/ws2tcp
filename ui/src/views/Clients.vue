<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ClientProfile, Endpoint, Tunnel } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import Modal from '@/components/Modal.vue'

const runtime = useRuntimeStore()
const toast = useToast()
const confirm = useConfirm()

const profiles = ref<ClientProfile[]>([])
const endpoints = ref<Endpoint[]>([])
const hiddenInvalidProfiles = ref(0)
const busy = ref(false)
const selectedProfileName = ref('')

const selectedProfile = computed(
  () => profiles.value.find(p => p.name === selectedProfileName.value) ?? null
)

type ProfileForm = { name: string; endpoint: string; client_id: string; client_secret: string }

const profileDialog = ref<{ open: boolean; editing: string; form: ProfileForm }>({
  open: false,
  editing: '',
  form: { name: '', endpoint: '', client_id: '', client_secret: '' }
})

const tunnelDialog = ref<{ open: boolean; profile: string; editing: string; form: Tunnel }>({
  open: false,
  profile: '',
  editing: '',
  form: emptyTunnel()
})

function emptyTunnel(): Tunnel {
  return { name: '', listen: '127.0.0.1:0', target_host: '', target_port: 22 }
}

async function load() {
  const [pErr, pData] = await api.get<ClientProfile[]>('/api/client/profiles')
  if (pErr) return toast.error(pErr.message)
  const [eErr, eData] = await api.get<Endpoint[]>('/api/client/endpoints')
  if (eErr) return toast.error(eErr.message)

  const next = (pData ?? [])
    .filter(item => item.name?.trim())
    .map(item => ({
      ...item,
      tunnels: Array.isArray(item.tunnels) ? item.tunnels : []
    }))
  hiddenInvalidProfiles.value = (pData?.length ?? 0) - next.length
  profiles.value = next
  endpoints.value = (eData ?? []).filter(item => item.name?.trim())

  if (!selectedProfileName.value && next[0]) {
    selectedProfileName.value = next[0].name
  } else if (selectedProfileName.value && !next.some(p => p.name === selectedProfileName.value)) {
    selectedProfileName.value = next[0]?.name ?? ''
  }
}

function openCreateProfile() {
  profileDialog.value = {
    open: true,
    editing: '',
    form: {
      name: '',
      endpoint: endpoints.value[0]?.name ?? '',
      client_id: '',
      client_secret: ''
    }
  }
}

function openEditProfile(p: ClientProfile) {
  profileDialog.value = {
    open: true,
    editing: p.name,
    form: {
      name: p.name,
      endpoint: p.endpoint,
      client_id: p.client_id,
      client_secret: ''
    }
  }
}

async function saveProfile() {
  const dlg = profileDialog.value
  busy.value = true
  if (dlg.editing) {
    const payload: Record<string, unknown> = {
      endpoint: dlg.form.endpoint,
      client_id: dlg.form.client_id
    }
    if (dlg.form.client_secret.trim()) payload.client_secret = dlg.form.client_secret.trim()
    const [err] = await api.patch(`/api/client/profiles/${encodeURIComponent(dlg.editing)}`, payload)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(`已更新 profile "${dlg.editing}"`)
  } else {
    const [err] = await api.post('/api/client/profiles', {
      ...dlg.form,
      tunnels: []
    })
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(`已创建 profile "${dlg.form.name}"`)
    selectedProfileName.value = dlg.form.name
  }
  profileDialog.value.open = false
  await load()
}

async function removeProfile(name: string) {
  const ok = await confirm.ask({
    title: '删除 profile',
    message: `确定删除 profile "${name}" 及其所有 tunnel 吗？`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  const [err] = await api.delete(`/api/client/profiles/${encodeURIComponent(name)}`)
  if (err) return toast.error(err.message)
  toast.success(`已删除 profile "${name}"`)
  await load()
}

function openCreateTunnel(profile: string) {
  tunnelDialog.value = { open: true, profile, editing: '', form: emptyTunnel() }
}

function openEditTunnel(profile: string, tunnel: Tunnel) {
  tunnelDialog.value = {
    open: true,
    profile,
    editing: tunnel.name,
    form: { ...tunnel }
  }
}

async function saveTunnel() {
  const dlg = tunnelDialog.value
  busy.value = true
  if (dlg.editing) {
    const payload: Record<string, unknown> = {
      listen: dlg.form.listen,
      target_host: dlg.form.target_host,
      target_port: dlg.form.target_port
    }
    const [err] = await api.patch(
      `/api/client/${encodeURIComponent(dlg.profile)}/tunnels/${encodeURIComponent(dlg.editing)}`,
      payload
    )
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(`已更新 tunnel "${dlg.editing}"`)
  } else {
    const [err] = await api.post(`/api/client/${encodeURIComponent(dlg.profile)}/tunnels`, dlg.form)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(`已创建 tunnel "${dlg.form.name}"`)
  }
  tunnelDialog.value.open = false
  await load()
}

async function removeTunnel(profile: string, tunnel: string) {
  const ok = await confirm.ask({
    title: '删除 tunnel',
    message: `确定从 "${profile}" 删除 tunnel "${tunnel}" 吗？`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  const [err] = await api.delete(
    `/api/client/${encodeURIComponent(profile)}/tunnels/${encodeURIComponent(tunnel)}`
  )
  if (err) return toast.error(err.message)
  toast.success(`已删除 tunnel "${tunnel}"`)
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
    <div class="page-toolbar">
      <h1 class="page-title">Clients</h1>
      <div class="toolbar-actions">
        <fluent-button appearance="stealth" @click="load">刷新</fluent-button>
        <fluent-button appearance="accent" @click="openCreateProfile">新增 profile</fluent-button>
      </div>
    </div>

    <div v-if="hiddenInvalidProfiles" class="banner error">
      已隐藏 {{ hiddenInvalidProfiles }} 条名称为空的无效 profile。
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Profile</th>
          <th>Endpoint</th>
          <th>Client ID</th>
          <th>Tunnels</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="profile in profiles"
          :key="profile.name"
          :class="{ 'row-active': profile.name === selectedProfileName }"
          @click="selectedProfileName = profile.name"
        >
          <td><strong>{{ profile.name }}</strong></td>
          <td>{{ profile.endpoint }}</td>
          <td>{{ profile.client_id }}</td>
          <td>{{ profile.tunnels.length }}</td>
          <td class="col-actions">
            <div class="row-actions" @click.stop>
              <fluent-button appearance="stealth" @click="openEditProfile(profile)">编辑</fluent-button>
              <fluent-button appearance="stealth" class="danger" @click="removeProfile(profile.name)">删除</fluent-button>
            </div>
          </td>
        </tr>
        <tr v-if="!profiles.length">
          <td colspan="5" class="empty-cell">尚未配置 client profile。</td>
        </tr>
      </tbody>
    </table>

    <section v-if="selectedProfile" class="sub-section">
      <div class="page-toolbar">
        <h2 class="sub-title">
          Tunnels · <span class="muted">{{ selectedProfile.name }}</span>
        </h2>
        <fluent-button appearance="accent" @click="openCreateTunnel(selectedProfile.name)">
          新增 tunnel
        </fluent-button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>名称</th>
            <th>监听</th>
            <th>目标</th>
            <th>状态</th>
            <th>连接数</th>
            <th class="col-actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tunnel in selectedProfile.tunnels" :key="tunnel.name">
            <td><strong>{{ tunnel.name }}</strong></td>
            <td>{{ tunnel.listen }}</td>
            <td>{{ tunnel.target_host }}:{{ tunnel.target_port }}</td>
            <td>
              <span class="badge" :class="tunnelStateClass(selectedProfile.name, tunnel.name)">
                {{ runtime.tunnelStatus(selectedProfile.name, tunnel.name)?.state ?? 'unknown' }}
              </span>
              <div v-if="runtime.tunnelStatus(selectedProfile.name, tunnel.name)?.error" class="inline-error">
                {{ runtime.tunnelStatus(selectedProfile.name, tunnel.name)?.error }}
              </div>
            </td>
            <td>{{ runtime.tunnelStatus(selectedProfile.name, tunnel.name)?.active_connections ?? 0 }}</td>
            <td class="col-actions">
              <div class="row-actions">
                <fluent-button appearance="stealth" @click="openEditTunnel(selectedProfile.name, tunnel)">编辑</fluent-button>
                <fluent-button appearance="stealth" class="danger" @click="removeTunnel(selectedProfile.name, tunnel.name)">删除</fluent-button>
              </div>
            </td>
          </tr>
          <tr v-if="!selectedProfile.tunnels.length">
            <td colspan="6" class="empty-cell">该 profile 尚无 tunnel。</td>
          </tr>
        </tbody>
      </table>
    </section>

    <Modal
      :open="profileDialog.open"
      :title="profileDialog.editing ? `编辑 profile：${profileDialog.editing}` : '新增 profile'"
      width="600px"
      @close="profileDialog.open = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">Profile 名称</span>
          <input
            v-model="profileDialog.form.name"
            class="text-input"
            :disabled="!!profileDialog.editing"
          />
        </label>
        <label>
          <span class="field-label">Endpoint</span>
          <select v-model="profileDialog.form.endpoint" class="select-input">
            <option disabled value="">选择 endpoint</option>
            <option v-for="endpoint in endpoints" :key="endpoint.name" :value="endpoint.name">
              {{ endpoint.name }}
            </option>
          </select>
        </label>
        <label>
          <span class="field-label">Client ID</span>
          <input v-model="profileDialog.form.client_id" class="text-input" />
        </label>
        <label>
          <span class="field-label">{{ profileDialog.editing ? '轮换 secret' : 'Client secret' }}</span>
          <input
            v-model="profileDialog.form.client_secret"
            class="text-input"
            type="password"
            :placeholder="profileDialog.editing ? '留空则保留当前 secret' : ''"
          />
        </label>
      </div>
      <template #footer>
        <fluent-button appearance="stealth" @click="profileDialog.open = false">取消</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="saveProfile">
          {{ busy ? '保存中…' : '保存' }}
        </fluent-button>
      </template>
    </Modal>

    <Modal
      :open="tunnelDialog.open"
      :title="tunnelDialog.editing ? `编辑 tunnel：${tunnelDialog.editing}` : `新增 tunnel · ${tunnelDialog.profile}`"
      width="600px"
      @close="tunnelDialog.open = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">名称</span>
          <input
            v-model="tunnelDialog.form.name"
            class="text-input"
            :disabled="!!tunnelDialog.editing"
          />
        </label>
        <label>
          <span class="field-label">监听</span>
          <input v-model="tunnelDialog.form.listen" class="text-input" />
        </label>
        <label>
          <span class="field-label">目标 host</span>
          <input v-model="tunnelDialog.form.target_host" class="text-input" />
        </label>
        <label>
          <span class="field-label">目标端口</span>
          <input v-model.number="tunnelDialog.form.target_port" class="text-input" type="number" />
        </label>
      </div>
      <template #footer>
        <fluent-button appearance="stealth" @click="tunnelDialog.open = false">取消</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="saveTunnel">
          {{ busy ? '保存中…' : '保存' }}
        </fluent-button>
      </template>
    </Modal>
  </section>
</template>
