<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRuntimeStore } from '@/stores/runtime'
import { useVersionStore } from '@/stores/version'
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const runtime = useRuntimeStore()
const ver = useVersionStore()
const router = useRouter()
const tabs = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/server', label: 'Server' },
  { to: '/clients', label: 'Clients' },
  { to: '/endpoints', label: 'Endpoints' }
]

onMounted(async () => {
  await Promise.all([ver.load(), runtime.refresh()])
  runtime.connect()
})

onBeforeUnmount(() => {
  runtime.disconnect()
})

async function logout() {
  runtime.disconnect()
  auth.logout()
  await router.push('/login')
}
</script>

<template>
  <div class="shell">
    <header class="shell-header">
      <div>
        <div class="brand-mark">ws2tcp</div>
        <div class="shell-subtitle">Tunnel manager</div>
      </div>
      <div class="shell-meta">
        <span class="badge" :class="runtime.connected ? 'badge-ok' : 'badge-warn'">
          {{ runtime.connected ? 'Live stream connected' : 'Live stream reconnecting' }}
        </span>
        <fluent-button appearance="stealth" @click="logout">Sign out</fluent-button>
      </div>
    </header>

    <nav class="shell-tabs" aria-label="Main sections">
      <router-link v-for="tab in tabs" :key="tab.to" :to="tab.to">{{ tab.label }}</router-link>
    </nav>

    <main class="shell-main">
      <div class="content-panel">
        <router-view />
      </div>
    </main>

    <footer class="shell-footer">
      <span v-if="ver.info">
        {{ ver.info.version }} · {{ ver.info.commit }} · {{ ver.info.go_version }}
      </span>
      <span v-else>Loading version…</span>
      <span>WebSocket → TCP tunnel manager</span>
    </footer>
  </div>
</template>
