<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/Modal.vue'
import { useContextStore } from '@/stores/context'
import { useToast } from '@/composables/useToast'
import { writeClipboardText } from '@/utils/clipboard'
import { formatDuration } from '@/utils/format'

const ctx = useContextStore()
const toast = useToast()
const { t } = useI18n()

const open = ref(false)

// 标志始终用英文 scope 字面量 (SYSTEM / USER), 不随语言切换.
const scopeText = computed(() => (ctx.info?.scope ?? '').toUpperCase())
const isSystem = computed(() => ctx.info?.scope === 'system')

const rows = computed(() => {
  const info = ctx.info
  if (!info) return []
  return [
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
const asText = computed(() => {
  const lines = [`${t('context.rowScope')}: ${scopeText.value}`]
  for (const row of rows.value) lines.push(`${row.label}: ${row.value}`)
  return lines.join('\n')
})

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
      class="ctx-chip"
      :class="isSystem ? 'is-system' : 'is-user'"
      :title="t('context.viewDetails')"
      @click="open = true"
    >
      <span class="ctx-chip-dot" />
      {{ scopeText }}
    </button>

    <Modal :open="open" :title="t('context.title')" width="32rem" @close="open = false">
      <div class="ctx">
        <div class="ctx-hero">
          <span class="ctx-scope" :class="isSystem ? 'is-system' : 'is-user'">
            <span class="ctx-scope-dot" />
            {{ scopeText }}
          </span>
          <span class="ctx-hero-sub">{{ t('context.subtitle') }}</span>
        </div>

        <dl class="ctx-rows">
          <div v-for="row in rows" :key="row.label" class="ctx-row">
            <dt>{{ row.label }}</dt>
            <dd>{{ row.value }}</dd>
          </div>
        </dl>
      </div>

      <template #footer>
        <button type="button" class="ctx-copy" @click="copyAll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 9h11v11H9z M5 5h11v3 M5 5v11h3" />
          </svg>
          {{ t('context.copyAll') }}
        </button>
      </template>
    </Modal>
  </template>
</template>

<style scoped>
/* --- top-bar chip --- */
/* Match the sibling .badge metrics exactly (padding / font-size / no border)
   so the chip lines up with the "connected" badge next to it. */
.ctx-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: none;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
}

.ctx-chip-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: currentColor;
}

.ctx-chip.is-system {
  color: var(--warn);
  background: color-mix(in srgb, var(--warn) 12%, transparent);
}

.ctx-chip.is-user {
  color: var(--text-muted);
  background: color-mix(in srgb, var(--text-muted) 14%, transparent);
}

.ctx-chip:hover {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 45%, transparent);
}

.ctx-chip:active {
  transform: translateY(1px);
}

/* --- modal body --- */
.ctx-hero {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.ctx-scope {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.ctx-scope-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 20%, transparent);
}

.ctx-scope.is-system {
  color: var(--warn);
  background: color-mix(in srgb, var(--warn) 13%, transparent);
}

.ctx-scope.is-user {
  color: var(--text-muted);
  background: color-mix(in srgb, var(--text-muted) 15%, transparent);
}

.ctx-hero-sub {
  color: var(--text-muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

.ctx-rows {
  margin: 0.35rem 0 0;
  display: flex;
  flex-direction: column;
}

.ctx-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  align-items: baseline;
  gap: 1rem;
  padding: 0.62rem 0.5rem;
  border-radius: 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--border) 55%, transparent);
  transition: background 0.12s ease;
}

.ctx-row:last-child {
  border-bottom: none;
}

.ctx-row:hover {
  background: var(--surface-muted);
}

.ctx-row dt {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.ctx-row dd {
  margin: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.5;
  word-break: break-all;
}

/* --- footer copy button --- */
.ctx-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--surface-muted);
  color: var(--text);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.ctx-copy svg {
  width: 1rem;
  height: 1rem;
}

.ctx-copy:hover {
  background: var(--surface);
  border-color: color-mix(in srgb, var(--accent) 60%, var(--border));
  color: var(--accent);
}
</style>
