<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHealthStore } from '@/stores/health'

const { t } = useI18n()
const health = useHealthStore()
const router = useRouter()
const route = useRoute()

function goBack() {
  const target = (route.query.redirect as string) || '/dashboard'
  router.replace(target)
}

onMounted(() => {
  // 进入页面时主动 retry. 恢复后跳回原路由 (?redirect= 由守卫塞入).
  health.startRetry(goBack)
  // 立即探一下, 不等 2s 第一次 tick.
  health.probe().then(s => {
    if (s === 'ok') {
      health.stopRetry()
      goBack()
    }
  })
})

onUnmounted(() => {
  health.stopRetry()
})

async function manualRetry() {
  const s = await health.probe()
  if (s === 'ok') goBack()
}
</script>

<template>
  <div class="backend-down-wrap">
    <div class="backend-down-card">
      <div class="page-kicker">ws2tcp</div>
      <h1>{{ t('backendDown.title') }}</h1>
      <p class="hint">{{ t('backendDown.hint') }}</p>
      <ul class="reasons">
        <li>{{ t('backendDown.reasonStopped') }}</li>
        <li>{{ t('backendDown.reasonPort') }}</li>
        <li>{{ t('backendDown.reasonNetwork') }}</li>
      </ul>
      <div class="actions">
        <fluent-button appearance="accent" @click="manualRetry">
          {{ t('backendDown.retry') }}
        </fluent-button>
        <span class="auto-retry">{{ t('backendDown.autoRetry') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backend-down-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}
.backend-down-card {
  max-width: 480px;
  width: 100%;
  padding: 32px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}
.page-kicker {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: 8px;
}
h1 {
  margin: 0 0 12px;
  font-size: 22px;
}
.hint {
  margin: 0 0 16px;
  opacity: 0.75;
  line-height: 1.5;
}
.reasons {
  margin: 0 0 24px;
  padding-left: 20px;
  line-height: 1.7;
  opacity: 0.7;
  font-size: 14px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.auto-retry {
  font-size: 13px;
  opacity: 0.6;
}
</style>
