<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
  width?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) emit('close')
}

watch(
  () => props.open,
  open => {
    if (open) window.addEventListener('keydown', onKey)
    else window.removeEventListener('keydown', onKey)
  },
  { immediate: true }
)

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="open" class="modal-mask" @mousedown.self="$emit('close')">
        <div class="modal-card" :style="width ? { width } : {}" role="dialog" aria-modal="true">
          <header v-if="title || $slots.header" class="modal-header">
            <slot name="header">
              <h2>{{ title }}</h2>
            </slot>
            <button class="modal-close" type="button" aria-label="Close" @click="$emit('close')">
              ×
            </button>
          </header>
          <div class="modal-body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
