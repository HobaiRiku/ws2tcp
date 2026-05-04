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
      <h1>Sign in</h1>
      <p class="hint">
        Paste a management API token. New tokens can be issued with
        <code>ws2tcp auth tokens issue</code>.
      </p>
      <div v-if="error" class="banner error">{{ error }}</div>
      <fluent-text-field
        type="password"
        :value="token"
        placeholder="Bearer token"
        @input="(e: Event) => (token = (e.target as HTMLInputElement).value)"
        @keydown.enter="submit"
      >
        API token
      </fluent-text-field>
      <div style="height: 0.75rem" />
      <fluent-button appearance="accent" :disabled="busy || !token" @click="submit">
        {{ busy ? 'Verifying…' : 'Sign in' }}
      </fluent-button>
      <p
        v-if="ver.info"
        style="margin: 1rem 0 0; font-size: 0.7rem; color: var(--text-muted); text-align: center"
      >
        ws2tcp {{ ver.info.version }} · {{ ver.info.commit }}
      </p>
    </div>
  </div>
</template>
