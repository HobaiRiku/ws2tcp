<script setup lang="ts">
import Modal from './Modal.vue'
import { useConfirm } from '@/composables/useConfirm'

const confirm = useConfirm()
</script>

<template>
  <Modal :open="confirm.state.open" :title="confirm.state.options.title ?? '请确认'" width="420px" @close="confirm.close(false)">
    <p class="confirm-msg">{{ confirm.state.options.message }}</p>
    <template #footer>
      <fluent-button appearance="stealth" @click="confirm.close(false)">
        {{ confirm.state.options.cancelText ?? '取消' }}
      </fluent-button>
      <fluent-button
        :appearance="confirm.state.options.danger ? 'accent' : 'accent'"
        :class="{ 'confirm-danger': confirm.state.options.danger }"
        @click="confirm.close(true)"
      >
        {{ confirm.state.options.confirmText ?? '确定' }}
      </fluent-button>
    </template>
  </Modal>
</template>
