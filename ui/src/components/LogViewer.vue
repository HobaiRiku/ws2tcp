<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import IconBtn from '@/components/IconBtn.vue'
import { api } from '@/api/client'
import type { EventMessage, LogRecentResponse, LogRecord } from '@/api/types'
import { useRuntimeStore } from '@/stores/runtime'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  open: boolean
  title: string
  // 过滤条件 — 既会通过 query 串发给后端拉历史, 也会用来过滤事件流.
  filters: Record<string, string>
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { t } = useI18n()
const runtime = useRuntimeStore()

const records = ref<LogRecord[]>([])
const autoScroll = ref(true)
const listEl = ref<HTMLElement | null>(null)
let unsubscribe: (() => void) | null = null
const MAX_RECORDS = 500

const filtersQuery = computed(() => {
  // 把 filters 拼成 ?attr=key:value 序列, 同时单独抽取后端识别的别名.
  const query: Record<string, string> = {}
  const attrPairs: string[] = []
  for (const [k, v] of Object.entries(props.filters)) {
    if (!v) continue
    if (k === 'level') {
      query.level = v
      continue
    }
    if (k === 'client' || k === 'client_id' || k === 'tunnel' || k === 'component') {
      query[k] = v
      continue
    }
    attrPairs.push(`${k}:${v}`)
  }
  return { query, attrPairs }
})

function buildURL() {
  const { query, attrPairs } = filtersQuery.value
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) params.set(k, v)
  for (const p of attrPairs) params.append('attr', p)
  params.set('limit', '300')
  return `/api/logs/recent?${params.toString()}`
}

function matches(event: EventMessage): boolean {
  const data = event.data ?? {}
  const attrs = (data.attrs ?? {}) as Record<string, unknown>
  for (const [k, v] of Object.entries(props.filters)) {
    if (!v) continue
    if (k === 'level') {
      const lvl = String(data.level ?? '').toUpperCase()
      if (!lvl.startsWith(v.toUpperCase())) return false
      continue
    }
    const got = attrs[k]
    if (got === undefined || String(got) !== v) return false
  }
  return true
}

async function loadHistory() {
  const [err, data] = await api.get<LogRecentResponse>(buildURL())
  if (err) return
  records.value = data?.records ?? []
  await scrollToBottomIfNeeded()
}

async function scrollToBottomIfNeeded() {
  if (!autoScroll.value) return
  await nextTick()
  const el = listEl.value
  if (el) el.scrollTop = el.scrollHeight
}

function onLogEvent(event: EventMessage) {
  if (!matches(event)) return
  const data = event.data ?? {}
  const rec: LogRecord = {
    time: event.time,
    level: String(data.level ?? ''),
    message: String(data.message ?? ''),
    attrs: (data.attrs ?? {}) as Record<string, unknown>
  }
  records.value = [...records.value, rec].slice(-MAX_RECORDS)
  scrollToBottomIfNeeded()
}

function onScroll() {
  const el = listEl.value
  if (!el) return
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 16
  autoScroll.value = atBottom
}

watch(
  () => props.open,
  open => {
    if (open) {
      records.value = []
      autoScroll.value = true
      loadHistory()
      unsubscribe = runtime.onLog(onLogEvent)
    } else if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }
})

function levelClass(level: string) {
  const lvl = level.toUpperCase()
  if (lvl.startsWith('ERROR')) return 'log-level-error'
  if (lvl.startsWith('WARN')) return 'log-level-warn'
  if (lvl.startsWith('DEBUG')) return 'log-level-debug'
  return 'log-level-info'
}

function fmtTime(t: string) {
  if (!t) return ''
  try {
    return new Date(t).toLocaleTimeString()
  } catch {
    return t
  }
}

function fmtAttrs(attrs?: Record<string, unknown>) {
  if (!attrs) return ''
  return Object.entries(attrs)
    .filter(([k]) => !(k in props.filters))
    .map(([k, v]) => `${k}=${v}`)
    .join(' ')
}
</script>

<template>
  <Modal :open="open" :title="title" width="820px" @close="emit('close')">
    <div class="log-toolbar">
      <span class="muted small">{{ t('logs.subtitle') }}</span>
      <span class="spacer" />
      <span v-if="autoScroll" class="badge badge-info nowrap">{{ t('logs.tailing') }}</span>
      <span v-else class="badge badge-warn nowrap">{{ t('logs.paused') }}</span>
      <IconBtn icon="refresh" size="sm" :title="t('common.refresh')" @click="loadHistory" />
    </div>
    <div ref="listEl" class="log-list" @scroll="onScroll">
      <div v-if="!records.length" class="empty-state">{{ t('logs.empty') }}</div>
      <div v-for="(rec, idx) in records" :key="idx" class="log-row">
        <span class="log-time mono">{{ fmtTime(rec.time) }}</span>
        <span class="log-level" :class="levelClass(rec.level)">{{ rec.level }}</span>
        <span class="log-message">{{ rec.message }}</span>
        <span class="log-attrs mono muted">{{ fmtAttrs(rec.attrs) }}</span>
      </div>
    </div>
    <template #footer>
      <fluent-button appearance="stealth" @click="emit('close')">{{ t('common.cancel') }}</fluent-button>
    </template>
  </Modal>
</template>

<style scoped>
.log-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.spacer { flex: 1; }
.log-list {
  height: 480px;
  overflow-y: auto;
  background: #111;
  color: #ddd;
  border-radius: 6px;
  padding: 8px 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  line-height: 1.5;
}
.log-row {
  display: grid;
  grid-template-columns: 80px 56px 1fr;
  grid-template-areas: 'time level message' '. . attrs';
  gap: 4px 10px;
  padding: 2px 0;
  border-bottom: 1px solid #1d1d1d;
}
.log-time { grid-area: time; color: #888; }
.log-level { grid-area: level; font-weight: 600; }
.log-message { grid-area: message; white-space: pre-wrap; word-break: break-word; }
.log-attrs { grid-area: attrs; color: #777; font-size: 11px; }
.log-level-error { color: #ff6b6b; }
.log-level-warn { color: #ffb454; }
.log-level-info { color: #6bb5ff; }
.log-level-debug { color: #888; }
.empty-state { color: #888; padding: 16px; text-align: center; }
</style>
