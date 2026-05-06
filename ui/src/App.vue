<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useVersionStore } from '@/stores/version'
import ToastHost from '@/components/ToastHost.vue'
import ConfirmHost from '@/components/ConfirmHost.vue'

const auth = useAuthStore()
const ver = useVersionStore()

onMounted(async () => {
  await Promise.all([auth.refresh(), ver.load()])
})
</script>

<template>
  <router-view />
  <ToastHost />
  <ConfirmHost />
</template>
