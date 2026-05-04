<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useVersionStore } from '@/stores/version'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const ver = useVersionStore()
const router = useRouter()

async function logout() {
  auth.logout()
  await router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="brand">ws2tcp</div>
      <router-link to="/dashboard">Dashboard</router-link>
      <router-link to="/server">Server</router-link>
      <router-link to="/clients">Clients</router-link>
      <router-link to="/endpoints">Endpoints</router-link>
    </aside>
    <header class="app-header">
      <h1><router-view name="title" />Management Console</h1>
      <div class="me">
        <span v-if="auth.isAuthed">Authenticated</span>
        <fluent-button appearance="stealth" @click="logout">Logout</fluent-button>
      </div>
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="app-footer">
      <span>
        <template v-if="ver.info">
          {{ ver.info.version }} · {{ ver.info.commit }} · {{ ver.info.build_date }} ·
          {{ ver.info.go_version }}
        </template>
      </span>
      <span>WebSocket → TCP tunnel</span>
    </footer>
  </div>
</template>
