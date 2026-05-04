<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVersionStore } from '@/stores/version'
import { onMounted } from 'vue'

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
    error.value = 'Token rejected. Check the value and try again.'
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
      <h1>Open the management console</h1>
      <p class="hint">Use the fixed management token from <code>config.yaml</code>.</p>
      <div v-if="error" class="banner error">{{ error }}</div>
      <label class="field-label" for="token">Management token</label>
      <input id="token" v-model="token" class="text-input" type="password" placeholder="Paste token" @keydown.enter="submit" />
      <fluent-button appearance="accent" :disabled="busy || !token" @click="submit">
        {{ busy ? 'Verifying…' : 'Sign in' }}
      </fluent-button>
      <p v-if="ver.info" class="login-version">ws2tcp {{ ver.info.version }} · {{ ver.info.commit }}</p>
    </div>
  </div>
</template>
