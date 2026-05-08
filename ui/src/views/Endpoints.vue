<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api } from '@/api/client'
import type { Endpoint } from '@/api/types'
import { eventChecked, eventNumber, eventValue } from '@/utils/forms'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import Modal from '@/components/Modal.vue'
import IconBtn from '@/components/IconBtn.vue'
import { useI18n } from 'vue-i18n'
import { parseServerConfigEnvelope, readClipboardText } from '@/utils/clipboard'

type EndpointForm = Endpoint & {
  ip: string
  aes_key: string
  ssl_reject_unauthorized: boolean
}

const { t } = useI18n()
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

async function openCreate() {
  editingName.value = ''
  form.value = emptyForm()
  dialogOpen.value = true
  // 如果剪贴板里有 server 配置 envelope, 自动预填.
  const text = await readClipboardText()
  const env = text ? parseServerConfigEnvelope(text) : null
  if (env) {
    form.value.host = env.host
    form.value.port = env.port
    form.value.path = env.path
    form.value.wss = env.wss
    form.value.aes_key = env.aes_key
    toast.info(t('endpoints.pastedFromServer'))
  }
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
    // 后端会直接回显 aes_key, 这里完整带回弹窗.
    aes_key: endpoint.aes_key ?? '',
    ssl_reject_unauthorized: endpoint.ssl_reject_unauthorized ?? false
  }
  dialogOpen.value = true
}

async function pasteFromClipboard() {
  const text = await readClipboardText()
  if (!text) {
    toast.error(t('toast.pasteFailed'))
    return
  }
  const env = parseServerConfigEnvelope(text)
  if (!env) {
    toast.error(t('toast.pasteEmpty'))
    return
  }
  form.value.host = env.host
  form.value.port = env.port
  form.value.path = env.path
  form.value.wss = env.wss
  form.value.aes_key = env.aes_key
  toast.success(t('toast.pastedFromClipboard'))
}

async function save() {
  busy.value = true
  if (form.value.aes_key.trim().length !== 32) {
    busy.value = false
    toast.error(t('endpoints.aesKeyTooShort'))
    return
  }

  if (editingName.value) {
    const payload: Record<string, unknown> = {
      host: form.value.host,
      ip: form.value.ip,
      port: form.value.port,
      path: form.value.path,
      wss: form.value.wss,
      aes_key: form.value.aes_key.trim(),
      ssl_reject_unauthorized: form.value.ssl_reject_unauthorized
    }
    const [err] = await api.patch(`/api/client/endpoints/${encodeURIComponent(editingName.value)}`, payload)
    busy.value = false
    if (err) return toast.error(err.message)
    toast.success(t('endpoints.saved', { name: editingName.value }))
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
  toast.success(t('endpoints.saved', { name: form.value.name }))
  dialogOpen.value = false
  await load()
}

async function removeEndpoint(name: string) {
  const ok = await confirm.ask({
    title: t('endpoints.deleteTitle'),
    message: t('endpoints.confirmDelete', { name }),
    danger: true,
    confirmText: t('common.delete')
  })
  if (!ok) return
  const [err] = await api.delete(`/api/client/endpoints/${encodeURIComponent(name)}`)
  if (err) return toast.error(err.message)
  toast.success(t('endpoints.deleted', { name }))
  await load()
}

onMounted(() => {
  load()
})
useAutoRefresh(load, 5000)
</script>

<template>
  <section class="page">
    <div class="page-toolbar">
      <h1 class="page-title">{{ t('endpoints.title') }}</h1>
      <div class="toolbar-actions">
        <IconBtn icon="refresh" :title="t('common.refresh')" @click="load" />
        <IconBtn icon="add" variant="primary" :title="t('common.add')" @click="openCreate" />
      </div>
    </div>

    <div v-if="hiddenInvalidCount" class="banner error">
      {{ t('endpoints.invalidHidden', { count: hiddenInvalidCount }) }}
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>{{ t('endpoints.columnName') }}</th>
          <th>{{ t('endpoints.columnHost') }}</th>
          <th>{{ t('endpoints.columnIP') }}</th>
          <th>{{ t('endpoints.columnPort') }}</th>
          <th>{{ t('endpoints.columnPath') }}</th>
          <th>{{ t('endpoints.columnWss') }}</th>
          <th>{{ t('endpoints.columnVerifyTLS') }}</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="endpoint in list" :key="endpoint.name">
          <td><strong>{{ endpoint.name }}</strong></td>
          <td>{{ endpoint.host }}</td>
          <td>{{ endpoint.ip || t('common.no') }}</td>
          <td>{{ endpoint.port }}</td>
          <td>{{ endpoint.path }}</td>
          <td>{{ endpoint.wss ? t('common.yes') : t('common.no') }}</td>
          <td>{{ endpoint.ssl_reject_unauthorized ? t('common.yes') : t('common.no') }}</td>
          <td class="col-actions">
            <div class="row-actions">
              <IconBtn icon="edit" :title="t('common.edit')" @click="openEdit(endpoint)" />
              <IconBtn
                icon="delete"
                variant="danger"
                :title="t('common.delete')"
                @click="removeEndpoint(endpoint.name)"
              />
            </div>
          </td>
        </tr>
        <tr v-if="!list.length">
          <td colspan="8" class="empty-cell">{{ t('endpoints.empty') }}</td>
        </tr>
      </tbody>
    </table>

    <Modal
      :open="dialogOpen"
      :title="editingName ? t('endpoints.editTitle', { name: editingName }) : t('endpoints.addTitle')"
      width="640px"
      @close="dialogOpen = false"
    >
      <div v-if="!editingName" class="paste-bar">
        <span class="muted">{{ t('endpoints.pasteServerConfig') }}</span>
        <IconBtn icon="paste" size="sm" :title="t('common.paste')" @click="pasteFromClipboard" />
      </div>

      <div class="form-grid two-up">
        <label>
          <span class="field-label">{{ t('endpoints.fieldName') }}</span>
          <fluent-text-field
            :value="form.name"
            :disabled="!!editingName"
            @input="form.name = eventValue($event)"
          />
        </label>
        <label>
          <span class="field-label">{{ t('endpoints.fieldHost') }}</span>
          <fluent-text-field
            :value="form.host"
            @input="form.host = eventValue($event)"
          />
        </label>
        <label>
          <span class="field-label">{{ t('endpoints.fieldIP') }}</span>
          <fluent-text-field
            :value="form.ip"
            @input="form.ip = eventValue($event)"
          />
        </label>
        <label>
          <span class="field-label">{{ t('endpoints.fieldPort') }}</span>
          <fluent-text-field
            type="number"
            :value="String(form.port || '')"
            @input="form.port = eventNumber($event)"
          />
        </label>
        <label>
          <span class="field-label">{{ t('endpoints.fieldPath') }}</span>
          <fluent-text-field
            :value="form.path"
            @input="form.path = eventValue($event)"
          />
        </label>
        <label>
          <span class="field-label">{{ t('endpoints.fieldAesKey') }}</span>
          <fluent-text-field
            class="mono"
            :value="form.aes_key"
            :placeholder="t('endpoints.aesKeyPlaceholderNew')"
            @input="form.aes_key = eventValue($event)"
          />
        </label>
      </div>

      <div class="checkbox-row fluent-switches">
        <fluent-switch :checked="form.wss" @change="form.wss = eventChecked($event)">
          {{ t('endpoints.fieldWss') }}
        </fluent-switch>
        <fluent-switch
          :checked="form.ssl_reject_unauthorized"
          @change="form.ssl_reject_unauthorized = eventChecked($event)"
        >
          {{ t('endpoints.fieldVerifyTLS') }}
        </fluent-switch>
      </div>

      <template #footer>
        <fluent-button appearance="stealth" @click="dialogOpen = false">{{ t('common.cancel') }}</fluent-button>
        <fluent-button appearance="accent" :disabled="busy" @click="save">
          {{ busy ? t('common.saving') : t('common.save') }}
        </fluent-button>
      </template>
    </Modal>
  </section>
</template>
