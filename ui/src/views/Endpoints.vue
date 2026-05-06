<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { Endpoint } from '@/api/types'
import { eventChecked } from '@/utils/forms'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import Modal from '@/components/Modal.vue'

type EndpointForm = Endpoint & {
  ip: string
  aes_key: string
  ssl_reject_unauthorized: boolean
}

const toast = useToast()
const confirm = useConfirm()

const list = ref<Endpoint[]>([])
const hiddenInvalidCount = ref(0)
const busy = ref(false)

const dialogOpen = ref(false)
const editingName = ref('')
const form = ref(emptyForm())

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

async function load() {
  const [err, data] = await api.get<Endpoint[]>('/api/client/endpoints')
  if (err) {
    toast.error(err.message)
    return
  }
  const next = (data ?? []).filter(item => item.name?.trim())
  hiddenInvalidCount.value = (data?.length ?? 0) - next.length
  list.value = next
}

function openCreate() {
  editingName.value = ''
  form.value = emptyForm()
  dialogOpen.value = true
}

function openEdit(endpoint: Endpoint) {
  editingName.value = endpoint.name
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
  dialogOpen.value = true
}

async function save() {
  busy.value = true
  if (!editingName.value && form.value.aes_key.trim().length !== 32) {
    busy.value = false
    toast.error('新建 endpoint 需要 32 字节的 AES key')
    return
  }

  if (editingName.value) {
    const payload: Record<string, unknown> = {
      host: form.value.host,
      ip: form.value.ip,
      port: form.value.port,
      path: form.value.path,
      wss: form.value.wss,
      ssl_reject_unauthorized: form.value.ssl_reject_unauthorized
    }
    if (form.value.aes_key.trim()) payload.aes_key = form.value.aes_key.trim()
    const [err] = await api.patch(`/api/client/endpoints/${encodeURIComponent(editingName.value)}`, payload)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(`已更新 endpoint "${editingName.value}"`)
    dialogOpen.value = false
    await load()
    return
  }

  const [err] = await api.post('/api/client/endpoints', {
    ...form.value,
    aes_key: form.value.aes_key.trim()
  })
  busy.value = false
  if (err) return toast.error(err.message)
  toast.success(`已创建 endpoint "${form.value.name}"`)
  dialogOpen.value = false
  await load()
}

async function removeEndpoint(name: string) {
  const ok = await confirm.ask({
    title: '删除 endpoint',
    message: `确定要删除 endpoint "${name}" 吗？`,
    danger: true,
    confirmText: '删除'
  })
  if (!ok) return
  const [err] = await api.delete(`/api/client/endpoints/${encodeURIComponent(name)}`)
  if (err) return toast.error(err.message)
  toast.success(`已删除 endpoint "${name}"`)
  await load()
}

onMounted(() => {
  load()
})
</script>

<template>
  <section class="page">
    <div class="page-toolbar">
      <h1 class="page-title">Endpoints</h1>
      <div class="toolbar-actions">
        <fluent-button appearance="stealth" @click="load">刷新</fluent-button>
        <fluent-button appearance="accent" @click="openCreate">新增 endpoint</fluent-button>
      </div>
    </div>

    <div v-if="hiddenInvalidCount" class="banner error">
      已隐藏 {{ hiddenInvalidCount }} 条名称为空的无效 endpoint。
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>名称</th>
          <th>Host</th>
          <th>IP</th>
          <th>端口</th>
          <th>路径</th>
          <th>WSS</th>
          <th>校验证书</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="endpoint in list" :key="endpoint.name">
          <td><strong>{{ endpoint.name }}</strong></td>
          <td>{{ endpoint.host }}</td>
          <td>{{ endpoint.ip || '—' }}</td>
          <td>{{ endpoint.port }}</td>
          <td>{{ endpoint.path }}</td>
          <td>{{ endpoint.wss ? '✓' : '—' }}</td>
          <td>{{ endpoint.ssl_reject_unauthorized ? '✓' : '—' }}</td>
          <td class="col-actions">
            <div class="row-actions">
              <fluent-button appearance="stealth" @click="openEdit(endpoint)">编辑</fluent-button>
              <fluent-button appearance="stealth" class="danger" @click="removeEndpoint(endpoint.name)">删除</fluent-button>
            </div>
          </td>
        </tr>
        <tr v-if="!list.length">
          <td colspan="8" class="empty-cell">尚未配置任何 endpoint。</td>
        </tr>
      </tbody>
    </table>

    <Modal
      :open="dialogOpen"
      :title="editingName ? `编辑 endpoint：${editingName}` : '新增 endpoint'"
      width="640px"
      @close="dialogOpen = false"
    >
      <div class="form-grid two-up">
        <label>
          <span class="field-label">名称</span>
          <input v-model="form.name" class="text-input" :disabled="!!editingName" />
        </label>
        <label>
          <span class="field-label">Host / SNI</span>
          <input v-model="form.host" class="text-input" />
        </label>
        <label>
          <span class="field-label">IP override</span>
          <input v-model="form.ip" class="text-input" />
        </label>
        <label>
          <span class="field-label">端口</span>
          <input v-model.number="form.port" class="text-input" type="number" />
        </label>
        <label>
          <span class="field-label">路径</span>
          <input v-model="form.path" class="text-input" />
        </label>
        <label>
          <span class="field-label">AES key</span>
          <input
            v-model="form.aes_key"
            class="text-input"
            type="password"
            :placeholder="editingName ? '留空则保留当前 key' : '32 字节 AES key'"
          />
        </label>
      </div>

      <div class="checkbox-row fluent-switches">
        <fluent-switch :checked="form.wss" @change="form.wss = eventChecked($event)">使用 WSS</fluent-switch>
        <fluent-switch
          :checked="form.ssl_reject_unauthorized"
          @change="form.ssl_reject_unauthorized = eventChecked($event)"
        >
          校验服务器 TLS 证书
        </fluent-switch>
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
