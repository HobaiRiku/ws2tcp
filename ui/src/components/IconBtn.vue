<script setup lang="ts">
type IconName =
  | 'add'
  | 'refresh'
  | 'edit'
  | 'delete'
  | 'expand'
  | 'collapse'
  | 'copy'
  | 'paste'
  | 'generate'
  | 'settings'
  | 'check'

defineProps<{
  icon: IconName
  title?: string
  variant?: 'default' | 'primary' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
}>()

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 24x24 viewBox stroke icons; light enough to inline.
const paths: Record<IconName, string> = {
  add: 'M12 5v14M5 12h14',
  refresh:
    'M4 4v6h6 M20 20v-6h-6 M20 9a8 8 0 0 0-14.5-2.5L4 10 M4 15a8 8 0 0 0 14.5 2.5L20 14',
  edit:
    'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z',
  delete:
    'M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6',
  expand: 'M6 9l6 6 6-6',
  collapse: 'M18 15l-6-6-6 6',
  copy: 'M9 9h11v11H9z M5 5h11v3 M5 5v11h3',
  paste:
    'M9 4h6 M9 4v2h6V4 M5 6h2 M17 6h2v15H5V6h2 M9 12h6 M9 16h4',
  generate:
    'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  check: 'M5 13l4 4L19 7'
}
</script>

<template>
  <button
    type="button"
    class="icon-btn"
    :class="[`icon-btn-${variant ?? 'default'}`, `icon-btn-${size ?? 'md'}`]"
    :title="title"
    :aria-label="title"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path :d="paths[icon]" />
    </svg>
  </button>
</template>
