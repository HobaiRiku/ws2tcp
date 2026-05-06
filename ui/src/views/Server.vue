<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { ACLRule, ServerClient, ServerSettings } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'
import { eventChecked } from '@/utils/forms'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import Modal from '@/components/Modal.vue'

const runtime = useRuntimeStore()
const toast = useToast()
const confirm = useConfirm()

const list = ref<ServerClient[]>([])
const settings = ref<ServerSettings | null>(null)
const busy = ref(false)

const dialogOpen = ref(false)
const editingId = ref('')
const form = ref({ id: '', secret: '', aclText: '' })

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

function openCreate() {
  editingId.value = ''
  form.value = { id: '', secret: '', aclText: '' }
  dialogOpen.value = true
}

function openEdit(client: ServerClient) {
  editingId.value = client.id
  form.value = { id: client.id, secret: '', aclText: aclToText(client.acl) }
  dialogOpen.value = true
}

async function save() {
  busy.value = true
  if (editingId.value) {
    const payload: Record<string, unknown> = { acl: parseACL(form.value.aclText) }
    if (form.value.secret.trim()) payload.secret = form.value.secret.trim()
    const [err] = await api.patch(`/api/server/clients/${encodeURIComponent(editingId.value)}`, payload)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(`已更新 client "${editingId.value}"`)
    dialogOpen.value = false
    await load()
    return
  }
  const [err] = await api.post('/api/server/clients', {
    id: form.value.id,
    secret: form.value.secret,
    acl: parseACL(form.value.aclText)
  })
  busy.value = false
  if (err) return toast.error(err.message)
  toast.success(`已创建 client "${form.value.id}"`)
  dialogOpen.value = false
  await load()
}

async function removeClient(id: string) {
  const ok = await confirm.ask({
    title: '删除服务端 client',
    message: `确定要删除 client "${id}" 吗？`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  const [err] = await api.delete(`/api/server/clients/${encodeURIComponent(id)}`)
  if (err) return toast.error(err.message)
  toast.success(`已删除 client "${id}"`)
  await load()
}

async function saveServerSettings() {
  if (!settings.value) return
  const [err] = await api.patch('/api/server/settings', {
    use_encryption: settings.value.use_encryption
  })
  if (err) return toast.error(err.message)
  toast.success('已保存服务端设置')
  await load()
}

function connectionCount(id: string) {
  return runtime.serverStats?.client_connections?.[id] ?? 0
}

const totalConnections = computed(() => runtime.activeServerConnections)

onMounted(() => {
  runtime.refresh()
  load()
})
</script>

<template>
  <section class="page">
    <div class="page-toolbar">
      <h1 class="page-title">Server</h1>
      <div class="toolbar-actions">
        <span class="badge badge-info">{{ totalConnections }} 活跃连接</span>
        <fluent-button appearance="stealth" @click="load">刷新</fluent-button>
        <fluent-button appearance="accent" @click="openCreate">新增 client</fluent-button>
      </div>
    </div>

    <section v-if="settings" class="settings-bar">
      <div class="settings-summary">
        <div><span class="field-label">监听</span><strong>{{ settings.listen }}</strong></div>
        <div><span class="field-label">WS 路径</span><strong>{{ settings.ws_path }}</strong></div>
        <div><span class="field-label">WS Host</span><strong>{{ settings.ws_host || '—' }}</strong></div>
        <div><span class="field-label">TLS</span><strong>{{ settings.tls_enabled ? 'enabled' : 'disabled' }}</strong></div>
      </div>
      <div class="settings-controls">
        <div class="checkbox-row fluent-switches">
          <fluent-switch
            :checked="settings.use_encryption"
            @change="settings.use_encryption = eventChecked($event)"
          >
            数据面端到端加密
          </fluent-switch>
          <fluent-switch :checked="settings.trust_proxy" disabled>信任代理头</fluent-switch>
        </div>
        <fluent-button appearance="accent" @click="saveServerSettings">保存设置</fluent-button>
      </div>
    </section>

    <table class="table">
      <thead>
        <tr>
          <th>Client ID</th>
          <th>状态</th>
          <th>活跃连接</th>
          <th>ACL 规则</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in list" :key="client.id">
          <td><strong>{{ client.id }}</strong></td>
          <td>
            <span class="badge" :class="connectionCount(client.id) > 0 ? 'badge-ok' : 'badge-neutral'">
              {{ connectionCount(client.id) > 0 ? 'active' : 'idle' }}
            </span>
          </td>
          <td>{{ connectionCount(client.id) }}</td>
          <td class="acl-cell">{{ client.acl.length }} 条</td>
          <td class="col-actions">
            <div class="row-actions">
              <fluent-button appearance="stealth" @click="openEdit(client)">编辑</fluent-button>
              <fluent-button appearance="stealth" class="danger" @click="removeClient(client.id)">删除</fluent-button>
            </div>
          </td>
        </tr>
        <tr v-if="!list.length">
          <td colspan="5" class="empty-cell">尚未配置任何 server client。</td>
        </tr>
      </tbody>
    </table>

    <Modal
      :open="dialogOpen"
      :title="editingId ? `编辑 client：${editingId}` : '新增 server client'"
      width="640px"
      @close="dialogOpen = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">Client ID</span>
          <input v-model="form.id" class="text-input" :disabled="!!editingId" />
        </label>
        <label>
          <span class="field-label">{{ editingId ? '轮换 secret' : '共享 secret' }}</span>
          <input
            v-model="form.secret"
            class="text-input"
            type="password"
            :placeholder="editingId ? '留空则保留当前 secret' : 'shared secret'"
          />
        </label>
        <label class="form-span-full">
          <span class="field-label">ACL 规则（每行一条：CIDR 端口列表，端口可用 * 表示全部）</span>
          <textarea
            v-model="form.aclText"
            class="text-area"
            rows="5"
            placeholder="192.168.1.0/24 22,80&#10;10.0.0.0/8 3306"
          />
        </label>
      </div>

      <template #footer>
        <fluent-button appearance="stealth" @click="dialogOpen = false">取消</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="save">
          {{ busy ? '保存中…' : '保存' }}
        </fluent-button>
      </template>
    </Modal>
  </section>
</template>
