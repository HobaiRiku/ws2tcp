import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api, tokenStore } from '@/api/client'
import type { AuthStatus } from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  const status = ref<AuthStatus | null>(null)
  const ready = ref(false)

  const isAuthed = computed(() => status.value !== null)

  async function refresh() {
    const [err, data] = await api.get<AuthStatus>('/api/auth/me')
    if (err) {
      status.value = null
      ready.value = true
      return false
    }
    status.value = data
    ready.value = true
    return true
  }

  async function login(token: string) {
    tokenStore.set(token.trim())
    const ok = await refresh()
    if (!ok) tokenStore.clear()
    return ok
  }

  function logout() {
    tokenStore.clear()
    status.value = null
  }

  return { status, ready, isAuthed, refresh, login, logout }
})
