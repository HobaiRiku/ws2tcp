<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ACLRule, ServerClient, ServerSettings } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'
import { eventChecked } from '@/utils/forms'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import Modal from '@/components/Modal.vue'
import IconBtn from '@/components/IconBtn.vue'
import LogViewer from '@/components/LogViewer.vue'
import { useI18n } from 'vue-i18n'
import {
  buildServerConfigEnvelope,
  generateAesKey32,
  writeClipboardText
} from '@/utils/clipboard'

const { t } = useI18n()
const runtime = useRuntimeStore()
const toast = useToast()
const confirm = useConfirm()

const list = ref<ServerClient[]>([])
const settings = ref<ServerSettings | null>(null)
const busy = ref(false)
const showAes = ref(false)

const clientDialog = ref<{
  open: boolean
  editing: string
  form: { id: string; secret: string; aclText: string }
}>({
  open: false,
  editing: '',
  form: { id: '', secret: '', aclText: '' }
})

const settingsDialog = ref<{ open: boolean; form: ServerSettings | null }>({
  open: false,
  form: null
})

// 日志 viewer 当前的过滤条件; null 表示未打开.
const logViewer = ref<{ title: string; filters: Record<string, string> } | null>(null)

function openServerLogs() {
  logViewer.value = {
    title: t('logs.serverTitle'),
    filters: { component: 'server' }
  }
}

function openClientLogs(id: string) {
  logViewer.value = {
    title: t('logs.clientTitle', { id }),
    filters: { client_id: id }
  }
}

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

async function load() {
  const [err, data] = await api.get<ServerClient[]>('/api/server/clients')
  if (err) {
    toast.error(err.message)
    return
  }
  list.value = data ?? []

  const [settingsErr, settingsData] = await api.get<ServerSettings>('/api/server/settings')
  if (!settingsErr && settingsData) settings.value = settingsData
}

function openCreateClient() {
  clientDialog.value = {
    open: true,
    editing: '',
    form: { id: '', secret: '', aclText: '' }
  }
}

function openEditClient(client: ServerClient) {
  clientDialog.value = {
    open: true,
    editing: client.id,
    form: { id: client.id, secret: client.secret ?? '', aclText: aclToText(client.acl) }
  }
}

async function saveClient() {
  const dlg = clientDialog.value
  busy.value = true
  if (dlg.editing) {
    const payload: Record<string, unknown> = {
      acl: parseACL(dlg.form.aclText),
      secret: dlg.form.secret
    }
    const [err] = await api.patch(`/api/server/clients/${encodeURIComponent(dlg.editing)}`, payload)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(t('server.clientSaved', { id: dlg.editing }))
    clientDialog.value.open = false
    await load()
    return
  }
  const [err] = await api.post('/api/server/clients', {
    id: dlg.form.id,
    secret: dlg.form.secret,
    acl: parseACL(dlg.form.aclText)
  })
  busy.value = false
  if (err) return toast.error(err.message)
  toast.success(t('server.clientSaved', { id: dlg.form.id }))
  clientDialog.value.open = false
  await load()
}

async function removeClient(id: string) {
  const ok = await confirm.ask({
    title: t('server.deleteClientTitle'),
    message: t('server.confirmDeleteClient', { id }),
    danger: true,
    confirmText: t('common.delete')
  })
  if (!ok) return
  const [err] = await api.delete(`/api/server/clients/${encodeURIComponent(id)}`)
  if (err) return toast.error(err.message)
  toast.success(t('server.clientDeleted', { id }))
  await load()
}

function openSettings() {
  if (!settings.value) return
  settingsDialog.value = { open: true, form: { ...settings.value } }
}

async function saveSettings() {
  const f = settingsDialog.value.form
  if (!f) return
  const orig = settings.value!
  const payload: Record<string, unknown> = {}
  const transportFields = [
    'listen',
    'ws_path',
    'ws_host',
    'aes_key',
    'tls_enabled',
    'tls_cert',
    'tls_key'
  ] as const
  let restart = false
  ;(['listen', 'ws_path', 'ws_host', 'aes_key', 'tls_cert', 'tls_key'] as const).forEach(k => {
    if (f[k] !== orig[k]) {
      payload[k] = f[k]
      if ((transportFields as readonly string[]).includes(k)) restart = true
    }
  })
  ;(['enabled', 'trust_proxy', 'use_encryption', 'tls_enabled'] as const).forEach(k => {
    if (f[k] !== orig[k]) {
      payload[k] = f[k]
      // enabled 也会决定 server 是否在跑, 走 transport 重启路径.
      if (k === 'enabled' || (transportFields as readonly string[]).includes(k)) restart = true
    }
  })
  if (!Object.keys(payload).length) {
    toast.info(t('common.nothingChanged'))
    settingsDialog.value.open = false
    return
  }
  busy.value = true
  const [err] = await api.patch('/api/server/settings', payload)
  busy.value = false
  if (err) return toast.error(err.message)
  toast.success(restart ? t('server.settingsSaved') : t('server.settingsSavedSoft'))
  settingsDialog.value.open = false
  await load()
}

async function copyServerConfig() {
  if (!settings.value) return
  // Host 字段尽量推断: 如果配置了 ws_host 就优先, 否则用 listen 的地址部分
  // (用户可能跑在反代后, 这里只是给一个起点供 endpoint 表单参考).
  const host = settings.value.ws_host || guessHostFromListen(settings.value.listen)
  const port = parsePort(settings.value.listen) || (settings.value.tls_enabled ? 443 : 80)
  const env = buildServerConfigEnvelope({
    host,
    port,
    path: settings.value.ws_path,
    wss: settings.value.tls_enabled,
    aes_key: settings.value.aes_key
  })
  const ok = await writeClipboardText(env)
  if (ok) toast.success(t('toast.copied'))
  else toast.error(t('toast.copyFailed'))
}

function guessHostFromListen(listen: string): string {
  const idx = listen.lastIndexOf(':')
  if (idx <= 0) return ''
  const host = listen.slice(0, idx)
  if (host === '0.0.0.0' || host === '::' || host === '[::]' || host === '') {
    return window.location.hostname
  }
  return host
}

function parsePort(listen: string): number {
  const idx = listen.lastIndexOf(':')
  if (idx < 0) return 0
  const n = Number(listen.slice(idx + 1))
  return Number.isFinite(n) ? n : 0
}

function connectionCount(id: string) {
  return runtime.serverStats?.client_connections?.[id] ?? 0
}

const totalConnections = computed(() => runtime.activeServerConnections)

onMounted(() => {
  runtime.refresh()
  load()
})
useAutoRefresh(load, 5000)
</script>

<template>
  <section class="page">
    <div class="page-toolbar">
      <h1 class="page-title">{{ t('server.title') }}</h1>
      <div class="toolbar-actions">
        <span class="badge badge-info nowrap">{{ t('server.activeConnections', { count: totalConnections }) }}</span>
        <IconBtn
          v-if="settings"
          icon="settings"
          :title="t('server.settingsTitle')"
          @click="openSettings"
        />
        <IconBtn
          v-if="settings"
          icon="copy"
          :title="t('server.copyServerConfig')"
          @click="copyServerConfig"
        />
        <IconBtn icon="logs" :title="t('logs.serverButton')" @click="openServerLogs" />
        <IconBtn icon="refresh" :title="t('common.refresh')" @click="load" />
        <IconBtn icon="add" variant="primary" :title="t('common.add')" @click="openCreateClient" />
      </div>
    </div>

    <section v-if="settings" class="settings-summary-card">
      <div class="summary-grid">
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryEnabled') }}</span>
          <strong>
            <span class="badge" :class="settings.enabled ? 'badge-ok' : 'badge-warn'">
              {{ settings.enabled ? t('common.enabled') : t('common.disabled') }}
            </span>
          </strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryListen') }}</span>
          <strong class="mono">{{ settings.listen || '—' }}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryWsPath') }}</span>
          <strong class="mono">{{ settings.ws_path || '—' }}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryWsHost') }}</span>
          <strong class="mono">{{ settings.ws_host || t('server.summaryAny') }}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryTls') }}</span>
          <strong>
            <span class="badge" :class="settings.tls_enabled ? 'badge-ok' : 'badge-neutral'">
              {{ settings.tls_enabled ? t('common.enabled') : t('common.disabled') }}
            </span>
          </strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryEncryption') }}</span>
          <strong>
            <span class="badge" :class="settings.use_encryption ? 'badge-ok' : 'badge-neutral'">
              {{ settings.use_encryption ? t('common.enabled') : t('common.disabled') }}
            </span>
          </strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">{{ t('server.summaryTrustProxy') }}</span>
          <strong>
            <span class="badge" :class="settings.trust_proxy ? 'badge-info' : 'badge-neutral'">
              {{ settings.trust_proxy ? t('common.enabled') : t('common.disabled') }}
            </span>
          </strong>
        </div>
        <div class="summary-cell summary-cell-wide">
          <span class="summary-label">{{ t('server.summaryAesKey') }}</span>
          <div class="summary-aes">
            <strong class="mono">
              {{ showAes ? settings.aes_key : '••••••••••••••••••••••••••••••••' }}
            </strong>
            <button type="button" class="link-btn" @click="showAes = !showAes">
              {{ showAes ? t('server.summaryHideKey') : t('server.summaryShowKey') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <table class="table">
      <thead>
        <tr>
          <th>{{ t('server.columnId') }}</th>
          <th>{{ t('server.columnSecret') }}</th>
          <th>{{ t('server.columnStatus') }}</th>
          <th>{{ t('server.columnConnections') }}</th>
          <th>{{ t('server.columnAcl') }}</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in list" :key="client.id">
          <td><strong>{{ client.id }}</strong></td>
          <td class="mono">{{ client.secret }}</td>
          <td>
            <span class="badge" :class="connectionCount(client.id) > 0 ? 'badge-ok' : 'badge-neutral'">
              {{ connectionCount(client.id) > 0 ? t('server.statusActive') : t('server.statusIdle') }}
            </span>
          </td>
          <td>{{ connectionCount(client.id) }}</td>
          <td class="acl-cell">{{ client.acl.length }}</td>
          <td class="col-actions">
            <div class="row-actions">
              <IconBtn icon="logs" :title="t('logs.clientButton')" @click="openClientLogs(client.id)" />
              <IconBtn icon="edit" :title="t('common.edit')" @click="openEditClient(client)" />
              <IconBtn
                icon="delete"
                variant="danger"
                :title="t('common.delete')"
                @click="removeClient(client.id)"
              />
            </div>
          </td>
        </tr>
        <tr v-if="!list.length">
          <td colspan="6" class="empty-cell">{{ t('server.empty') }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Server client dialog -->
    <Modal
      :open="clientDialog.open"
      :title="clientDialog.editing ? t('server.editClient', { id: clientDialog.editing }) : t('server.addClient')"
      width="640px"
      @close="clientDialog.open = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">{{ t('server.fieldClientId') }}</span>
          <input v-model="clientDialog.form.id" class="text-input" :disabled="!!clientDialog.editing" />
        </label>
        <label>
          <span class="field-label">{{ t('server.fieldSecret') }}</span>
          <input v-model="clientDialog.form.secret" class="text-input" type="text" />
        </label>
        <label class="form-span-full">
          <span class="field-label">{{ t('server.fieldAcl') }}</span>
          <textarea
            v-model="clientDialog.form.aclText"
            class="text-area"
            rows="5"
            :placeholder="t('server.aclPlaceholder')"
          />
        </label>
      </div>

      <template #footer>
        <fluent-button appearance="stealth" @click="clientDialog.open = false">{{ t('common.cancel') }}</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="saveClient">
          {{ busy ? t('common.saving') : t('common.save') }}
        </fluent-button>
      </template>
    </Modal>

    <!-- Server settings dialog -->
    <Modal
      :open="settingsDialog.open"
      :title="t('server.settingsTitle')"
      width="680px"
      @close="settingsDialog.open = false"
    >
      <template v-if="settingsDialog.form">
        <p class="muted small">{{ t('server.transportRestartHint') }}</p>
        <div class="checkbox-row fluent-switches">
          <fluent-switch
            :checked="settingsDialog.form.enabled"
            @change="settingsDialog.form.enabled = eventChecked($event)"
          >
            {{ t('server.fieldEnabled') }}
          </fluent-switch>
          <span class="muted small">{{ t('server.fieldEnabledHint') }}</span>
        </div>
        <div class="form-grid two-up">
          <label>
            <span class="field-label">{{ t('server.fieldListen') }}</span>
            <input v-model="settingsDialog.form.listen" class="text-input" :placeholder="t('server.listenHelp')" />
          </label>
          <label>
            <span class="field-label">{{ t('server.fieldWsPath') }}</span>
            <input v-model="settingsDialog.form.ws_path" class="text-input" />
          </label>
          <label>
            <span class="field-label">{{ t('server.fieldWsHost') }}</span>
            <input v-model="settingsDialog.form.ws_host" class="text-input" />
          </label>
          <label class="form-span-full">
            <span class="field-label">{{ t('server.fieldAesKey') }}</span>
            <div class="inline-group">
              <input v-model="settingsDialog.form.aes_key" class="text-input mono" type="text" />
              <IconBtn
                icon="generate"
                size="sm"
                :title="t('server.aesGenerate')"
                @click="settingsDialog.form.aes_key = generateAesKey32()"
              />
            </div>
          </label>
          <label>
            <span class="field-label">{{ t('server.fieldTlsCert') }}</span>
            <input v-model="settingsDialog.form.tls_cert" class="text-input" />
          </label>
          <label>
            <span class="field-label">{{ t('server.fieldTlsKey') }}</span>
            <input v-model="settingsDialog.form.tls_key" class="text-input" />
          </label>
        </div>

        <div class="checkbox-row fluent-switches">
          <fluent-switch
            :checked="settingsDialog.form.use_encryption"
            @change="settingsDialog.form.use_encryption = eventChecked($event)"
          >
            {{ t('server.fieldUseEncryption') }}
          </fluent-switch>
          <fluent-switch
            :checked="settingsDialog.form.trust_proxy"
            @change="settingsDialog.form.trust_proxy = eventChecked($event)"
          >
            {{ t('server.fieldTrustProxy') }}
          </fluent-switch>
          <fluent-switch
            :checked="settingsDialog.form.tls_enabled"
            @change="settingsDialog.form.tls_enabled = eventChecked($event)"
          >
            {{ t('server.fieldTlsEnabled') }}
          </fluent-switch>
        </div>
      </template>

      <template #footer>
        <fluent-button appearance="stealth" @click="settingsDialog.open = false">{{ t('common.cancel') }}</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="saveSettings">
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
