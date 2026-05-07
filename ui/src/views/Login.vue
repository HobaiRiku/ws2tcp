<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVersionStore } from '@/stores/version'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const token = ref('')
const error = ref('')
const busy = ref(false)
const auth = useAuthStore()
const ver = useVersionStore()
const router = useRouter()
const route = useRoute()

onMounted(() => ver.load())

async function submit() {
  error.value = ''
  busy.value = true
  const ok = await auth.login(token.value)
  busy.value = false
  if (!ok) {
    error.value = t('login.rejected')
    return
  }
  const next = (route.query.redirect as string) || '/dashboard'
  await router.push(next)
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="page-kicker">ws2tcp</div>
      <h1>{{ t('login.heading') }}</h1>
      <p class="hint">{{ t('login.hint') }}</p>
      <div v-if="error" class="banner error">{{ error }}</div>
      <label class="field-label" for="token">{{ t('login.tokenLabel') }}</label>
      <input
        id="token"
        v-model="token"
        class="text-input"
        type="password"
        :placeholder="t('login.tokenPlaceholder')"
        @keydown.enter="submit"
      />
      <fluent-button appearance="accent" :disabled="busy || !token" @click="submit">
        {{ busy ? t('login.verifying') : t('login.signIn') }}
      </fluent-button>
      <p v-if="ver.info" class="login-version">ws2tcp {{ ver.info.version }} · {{ ver.info.commit }}</p>
    </div>
  </div>
</template>
