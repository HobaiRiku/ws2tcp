<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRuntimeStore } from '@/stores/runtime'
import { useVersionStore } from '@/stores/version'
import { useContextStore } from '@/stores/context'
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { currentLocale, localeOptions, setLocale, type LocaleKey } from '@/i18n'
import IconBtn from '@/components/IconBtn.vue'
import ContextBadge from '@/components/ContextBadge.vue'

const auth = useAuthStore()
const runtime = useRuntimeStore()
const ver = useVersionStore()
const ctx = useContextStore()
const router = useRouter()
const { t } = useI18n()

const tabs = [
  { to: '/dashboard', key: 'overview' as const },
  { to: '/server', key: 'server' as const },
  { to: '/clients', key: 'clients' as const },
  { to: '/endpoints', key: 'endpoints' as const }
]

onMounted(async () => {
  await Promise.all([ver.load(), ctx.load(), runtime.refresh()])
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

function switchLocale(event: Event) {
  // fluent-select 把当前值放在 event.target.value 上, 与原生 select 一致.
  const value = (event.target as { value?: string }).value
  if (!value) return
  setLocale(value as LocaleKey)
}
</script>

<template>
  <div class="shell">
    <header class="shell-header">
      <div class="brand-mark">{{ t('shell.brand') }}</div>
      <nav class="shell-tabs" aria-label="Main sections">
        <router-link v-for="tab in tabs" :key="tab.to" :to="tab.to">
          {{ t(`shell.${tab.key}`) }}
        </router-link>
      </nav>
      <div class="shell-meta">
        <ContextBadge />
        <span class="badge nowrap" :class="runtime.connected ? 'badge-ok' : 'badge-warn'">
          {{ runtime.connected ? t('shell.streamConnected') : t('shell.streamReconnecting') }}
        </span>
        <fluent-select class="locale-select" :value="currentLocale()" @change="switchLocale">
          <fluent-option v-for="opt in localeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </fluent-option>
        </fluent-select>
        <IconBtn icon="logout" :title="t('shell.signOut')" @click="logout" />
      </div>
    </header>

    <main class="shell-main">
      <div class="content-panel">
        <router-view />
      </div>
    </main>

    <footer class="shell-footer">
      <span v-if="ver.info">
        {{ ver.info.version }} · {{ ver.info.commit }} · {{ ver.info.go_version }}
      </span>
      <span v-else>{{ t('shell.loadingVersion') }}</span>
      <span>{{ t('shell.footerTagline') }}</span>
    </footer>
  </div>
</template>
