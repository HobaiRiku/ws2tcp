<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { api } from '@/api/client'
import type { ClientProfile, Endpoint, Tunnel } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import Modal from '@/components/Modal.vue'
import IconBtn from '@/components/IconBtn.vue'
import LogViewer from '@/components/LogViewer.vue'
import { eventValue } from '@/utils/forms'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const runtime = useRuntimeStore()
const toast = useToast()
const confirm = useConfirm()

const profiles = ref<ClientProfile[]>([])
const endpoints = ref<Endpoint[]>([])
const hiddenInvalidProfiles = ref(0)
const busy = ref(false)
// 哪些 profile 行处于展开状态; 默认全部展开 (新加载的也默认展开).
const expanded = reactive<Record<string, boolean>>({})

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
  return { name: '', listen: '127.0.0.1:', target_host: '', target_port: 22 }
}

const logViewer = ref<{ title: string; filters: Record<string, string> } | null>(null)

function openProfileLogs(name: string) {
  logViewer.value = {
    title: t('logs.profileTitle', { name }),
    filters: { client: name }
  }
}

function openTunnelLogs(profile: string, tunnel: string) {
  logViewer.value = {
    title: t('logs.tunnelTitle', { profile, tunnel }),
    filters: { client: profile, tunnel }
  }
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
  // 新出现的 profile 默认展开; 已有的保持用户当前的状态 (展开/收起).
  for (const item of next) {
    if (!(item.name in expanded)) expanded[item.name] = true
  }
}

function toggleExpand(name: string) {
  expanded[name] = !expanded[name]
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
      client_secret: p.client_secret ?? ''
    }
  }
}

async function saveProfile() {
  const dlg = profileDialog.value
  busy.value = true
  if (dlg.editing) {
    const payload: Record<string, unknown> = {
      endpoint: dlg.form.endpoint,
      client_id: dlg.form.client_id,
      client_secret: dlg.form.client_secret
    }
    if (dlg.form.name && dlg.form.name !== dlg.editing) {
      payload.name = dlg.form.name
    }
    const [err] = await api.patch(`/api/client/profiles/${encodeURIComponent(dlg.editing)}`, payload)
    busy.value = false
    if (err) return toast.error(err.message)
    // 重命名后展开状态用旧 key 失效, 把它迁到新 key 上, 列表刷新前 UI 不闪.
    if (dlg.form.name && dlg.form.name !== dlg.editing) {
      expanded[dlg.form.name] = expanded[dlg.editing] ?? false
      delete expanded[dlg.editing]
    }
    toast.success(t('clients.profileSaved', { name: dlg.form.name || dlg.editing }))
  } else {
    const [err] = await api.post('/api/client/profiles', { ...dlg.form, tunnels: [] })
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(t('clients.profileSaved', { name: dlg.form.name }))
    expanded[dlg.form.name] = true
  }
  profileDialog.value.open = false
  await load()
}

async function removeProfile(name: string) {
  const ok = await confirm.ask({
    title: t('clients.deleteProfileTitle'),
    message: t('clients.confirmDeleteProfile', { name }),
    danger: true,
    confirmText: t('common.delete')
  })
  if (!ok) return
  const [err] = await api.delete(`/api/client/profiles/${encodeURIComponent(name)}`)
  if (err) return toast.error(err.message)
  toast.success(t('clients.profileDeleted', { name }))
  await load()
}

function openCreateTunnel(profile: string) {
  tunnelDialog.value = { open: true, profile, editing: '', form: emptyTunnel() }
}

function openEditTunnel(profile: string, tunnel: Tunnel) {
  tunnelDialog.value = { open: true, profile, editing: tunnel.name, form: { ...tunnel } }
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
    toast.success(t('clients.tunnelSaved', { name: dlg.editing }))
  } else {
    const [err] = await api.post(`/api/client/${encodeURIComponent(dlg.profile)}/tunnels`, dlg.form)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(t('clients.tunnelSaved', { name: dlg.form.name }))
  }
  tunnelDialog.value.open = false
  await load()
}

async function removeTunnel(profile: string, tunnel: string) {
  const ok = await confirm.ask({
    title: t('clients.deleteTunnelTitle'),
    message: t('clients.confirmDeleteTunnel', { profile, name: tunnel }),
    danger: true,
    confirmText: t('common.delete')
  })
  if (!ok) return
  const [err] = await api.delete(
    `/api/client/${encodeURIComponent(profile)}/tunnels/${encodeURIComponent(tunnel)}`
  )
  if (err) return toast.error(err.message)
  toast.success(t('clients.tunnelDeleted', { name: tunnel }))
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
useAutoRefresh(load, 5000)
</script>

<template>
  <section class="page">
    <div class="page-toolbar">
      <h1 class="page-title">{{ t('clients.title') }}</h1>
      <div class="toolbar-actions">
        <IconBtn icon="refresh" :title="t('common.refresh')" @click="load" />
        <IconBtn icon="add" variant="primary" :title="t('common.add')" @click="openCreateProfile" />
      </div>
    </div>

    <div v-if="hiddenInvalidProfiles" class="banner error">
      {{ t('clients.invalidHidden', { count: hiddenInvalidProfiles }) }}
    </div>

    <table class="table expandable">
      <thead>
        <tr>
          <th class="col-toggle"></th>
          <th>{{ t('clients.columnProfile') }}</th>
          <th>{{ t('clients.columnEndpoint') }}</th>
          <th>{{ t('clients.columnClientId') }}</th>
          <th>{{ t('clients.columnTunnels') }}</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="profile in profiles" :key="profile.name">
          <tr class="row-clickable" @click="toggleExpand(profile.name)">
            <td class="col-toggle">
              <IconBtn
                :icon="expanded[profile.name] ? 'collapse' : 'expand'"
                size="sm"
                :title="expanded[profile.name] ? t('common.collapse') : t('common.expand')"
                @click.stop="toggleExpand(profile.name)"
              />
            </td>
            <td><strong>{{ profile.name }}</strong></td>
            <td>{{ profile.endpoint }}</td>
            <td>{{ profile.client_id }}</td>
            <td>{{ profile.tunnels.length }}</td>
            <td class="col-actions">
              <div class="row-actions" @click.stop>
                <IconBtn icon="logs" :title="t('logs.profileButton')" @click="openProfileLogs(profile.name)" />
                <IconBtn icon="edit" :title="t('common.edit')" @click="openEditProfile(profile)" />
                <IconBtn
                  icon="delete"
                  variant="danger"
                  :title="t('common.delete')"
                  @click="removeProfile(profile.name)"
                />
              </div>
            </td>
          </tr>
          <tr v-if="expanded[profile.name]" class="row-detail">
            <td colspan="6">
              <div class="detail-toolbar">
                <span class="detail-title">{{ t('clients.columnTunnels') }} · {{ profile.name }}</span>
                <IconBtn
                  icon="add"
                  variant="primary"
                  size="sm"
                  :title="t('clients.addTunnel')"
                  @click="openCreateTunnel(profile.name)"
                />
              </div>
              <table class="table sub-table">
                <thead>
                  <tr>
                    <th>{{ t('clients.columnTunnelName') }}</th>
                    <th>{{ t('clients.columnTunnelListen') }}</th>
                    <th>{{ t('clients.columnTunnelTarget') }}</th>
                    <th>{{ t('clients.columnTunnelStatus') }}</th>
                    <th>{{ t('clients.columnTunnelConnections') }}</th>
                    <th class="col-actions"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tunnel in profile.tunnels" :key="tunnel.name">
                    <td><strong>{{ tunnel.name }}</strong></td>
                    <td>{{ tunnel.listen }}</td>
                    <td>{{ tunnel.target_host }}:{{ tunnel.target_port }}</td>
                    <td>
                      <span class="badge" :class="tunnelStateClass(profile.name, tunnel.name)">
                        {{ runtime.tunnelStatus(profile.name, tunnel.name)?.state ?? t('common.unknown') }}
                      </span>
                      <div
                        v-if="runtime.tunnelStatus(profile.name, tunnel.name)?.error"
                        class="inline-error"
                      >
                        {{ runtime.tunnelStatus(profile.name, tunnel.name)?.error }}
                      </div>
                    </td>
                    <td>{{ runtime.tunnelStatus(profile.name, tunnel.name)?.active_connections ?? 0 }}</td>
                    <td class="col-actions">
                      <div class="row-actions">
                        <IconBtn
                          icon="logs"
                          :title="t('logs.tunnelButton')"
                          @click="openTunnelLogs(profile.name, tunnel.name)"
                        />
                        <IconBtn icon="edit" :title="t('common.edit')" @click="openEditTunnel(profile.name, tunnel)" />
                        <IconBtn
                          icon="delete"
                          variant="danger"
                          :title="t('common.delete')"
                          @click="removeTunnel(profile.name, tunnel.name)"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr v-if="!profile.tunnels.length">
                    <td colspan="6" class="empty-cell">{{ t('clients.emptyTunnels') }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </template>
        <tr v-if="!profiles.length">
          <td colspan="6" class="empty-cell">{{ t('clients.empty') }}</td>
        </tr>
      </tbody>
    </table>

    <Modal
      :open="profileDialog.open"
      :title="profileDialog.editing ? t('clients.editProfileTitle', { name: profileDialog.editing }) : t('clients.addProfileTitle')"
      width="600px"
      @close="profileDialog.open = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">{{ t('clients.fieldProfileName') }}</span>
          <input v-model="profileDialog.form.name" class="text-input" />
        </label>
        <label>
          <span class="field-label">{{ t('clients.fieldEndpoint') }}</span>
          <fluent-select
            class="select-input"
            :value="profileDialog.form.endpoint"
            @change="profileDialog.form.endpoint = eventValue($event)"
          >
            <fluent-option v-for="endpoint in endpoints" :key="endpoint.name" :value="endpoint.name">
              {{ endpoint.name }}
            </fluent-option>
          </fluent-select>
        </label>
        <label>
          <span class="field-label">{{ t('clients.fieldClientId') }}</span>
          <input v-model="profileDialog.form.client_id" class="text-input" />
        </label>
        <label>
          <span class="field-label">{{ t('clients.fieldClientSecret') }}</span>
          <input v-model="profileDialog.form.client_secret" class="text-input" type="text" />
        </label>
      </div>
      <template #footer>
        <fluent-button appearance="stealth" @click="profileDialog.open = false">{{ t('common.cancel') }}</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="saveProfile">
          {{ busy ? t('common.saving') : t('common.save') }}
        </fluent-button>
      </template>
    </Modal>

    <Modal
      :open="tunnelDialog.open"
      :title="tunnelDialog.editing
        ? t('clients.editTunnelTitle', { name: tunnelDialog.editing })
        : t('clients.addTunnelTitle', { profile: tunnelDialog.profile })"
      width="600px"
      @close="tunnelDialog.open = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">{{ t('clients.fieldTunnelName') }}</span>
          <input
            v-model="tunnelDialog.form.name"
            class="text-input"
            :disabled="!!tunnelDialog.editing"
          />
        </label>
        <label>
          <span class="field-label">{{ t('clients.fieldListen') }}</span>
          <input v-model="tunnelDialog.form.listen" class="text-input" />
        </label>
        <label>
          <span class="field-label">{{ t('clients.fieldTargetHost') }}</span>
          <input v-model="tunnelDialog.form.target_host" class="text-input" />
        </label>
        <label>
          <span class="field-label">{{ t('clients.fieldTargetPort') }}</span>
          <input v-model.number="tunnelDialog.form.target_port" class="text-input" type="number" />
        </label>
      </div>
      <template #footer>
        <fluent-button appearance="stealth" @click="tunnelDialog.open = false">{{ t('common.cancel') }}</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="saveTunnel">
          {{ busy ? t('common.saving') : t('common.save') }}
        </fluent-button>
      </template>
    </Modal>

    <LogViewer
      v-if="logViewer"
      :open="!!logViewer"
      :title="logViewer.title"
      :filters="logViewer.filters"
      @close="logViewer = null"
    />
  </section>
</template>
