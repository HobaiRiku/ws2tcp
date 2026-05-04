import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api, tokenStore } from '@/api/client'
import type { AuthMe } from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  const me = ref<AuthMe | null>(null)
  const ready = ref(false)

  const isAuthed = computed(() => me.value !== null)

  async function refresh() {
    const [err, data] = await api.get<AuthMe>('/api/auth/me')
    if (err) {
      me.value = null
      ready.value = true
      return false
    }
    me.value = data
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
    me.value = null
  }

  function hasScope(scope: string) {
    if (!me.value) return false
    if (me.value.scopes.includes('admin')) return true
    return me.value.scopes.includes(scope)
  }

  return { me, ready, isAuthed, refresh, login, logout, hasScope }
})
