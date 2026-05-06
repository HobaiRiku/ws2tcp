<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const toast = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-host" role="status" aria-live="polite">
      <transition-group name="toast" tag="div" class="toast-stack">
        <div
          v-for="item in toast.state.items"
          :key="item.id"
          class="toast"
          :class="`toast-${item.kind}`"
          @click="toast.dismiss(item.id)"
        >
          <span class="toast-dot" />
          <span class="toast-msg">{{ item.message }}</span>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>
