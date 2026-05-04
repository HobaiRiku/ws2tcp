<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useVersionStore } from '@/stores/version'

const auth = useAuthStore()
const ver = useVersionStore()

onMounted(async () => {
  await Promise.all([auth.refresh(), ver.load()])
})
</script>

<template>
  <router-view />
</template>
