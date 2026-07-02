<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/Modal.vue'
import IconBtn from '@/components/IconBtn.vue'
import { useContextStore } from '@/stores/context'
import { useToast } from '@/composables/useToast'
import { writeClipboardText } from '@/utils/clipboard'
import { formatDuration } from '@/utils/format'

const ctx = useContextStore()
const toast = useToast()
const { t } = useI18n()

const open = ref(false)

const scopeLabel = computed(() => {
  const scope = ctx.info?.scope
  if (!scope) return ''
  return scope === 'system' ? t('context.scopeSystem') : t('context.scopeUser')
})

// system 层用 warn 色提醒"这是全局实例, 改动影响所有用户"; user 层用中性色.
const badgeClass = computed(() => (ctx.info?.scope === 'system' ? 'badge-warn' : 'badge-neutral'))

const rows = computed(() => {
  const info = ctx.info
  if (!info) return []
  return [
    { label: t('context.rowScope'), value: scopeLabel.value },
    { label: t('context.rowHome'), value: info.home },
    { label: t('context.rowConfig'), value: info.config_path },
    { label: t('context.rowLog'), value: info.log_file },
    { label: t('context.rowPlatform'), value: `${info.os}/${info.arch}` },
    { label: t('context.rowPid'), value: String(info.pid) },
    { label: t('context.rowUptime'), value: formatDuration(info.uptime_seconds) },
    { label: t('context.rowVersion'), value: `${info.version.version} (${info.version.commit})` }
  ]
})

// 复制成纯文本块, 等价于 CLI `ws2tcp status` 的可粘贴形式.
const asText = computed(() => rows.value.map(r => `${r.label}: ${r.value}`).join('\n'))

async function copyAll() {
  const ok = await writeClipboardText(asText.value)
  if (ok) {
    toast.success(t('toast.copied'))
    return
  }
  toast.error(t('toast.copyFailed'))
}
</script>

<template>
  <template v-if="ctx.info">
    <button
      type="button"
      class="badge nowrap context-badge"
      :class="badgeClass"
      :title="t('context.viewDetails')"
      @click="open = true"
    >
      {{ scopeLabel }}
    </button>

    <Modal :open="open" :title="t('context.title')" width="34rem" @close="open = false">
      <dl class="context-list">
        <template v-for="row in rows" :key="row.label">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </template>
      </dl>
      <template #footer>
        <IconBtn icon="copy" :title="t('context.copyAll')" @click="copyAll" />
        <span class="context-copy-hint">{{ t('context.copyAll') }}</span>
      </template>
    </Modal>
  </template>
</template>

<style scoped>
.context-badge {
  cursor: pointer;
  border: none;
  font: inherit;
}

.context-list {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.4rem 1rem;
  margin: 0;
}

.context-list dt {
  font-weight: 600;
  opacity: 0.75;
  white-space: nowrap;
}

.context-list dd {
  margin: 0;
  word-break: break-all;
  font-family: var(--font-mono, ui-monospace, monospace);
}

.context-copy-hint {
  opacity: 0.7;
  font-size: 0.85em;
  align-self: center;
}
</style>
