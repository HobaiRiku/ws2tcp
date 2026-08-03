import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/client'
import type { SystemContext } from '@/api/types'

export const useContextStore = defineStore('context', () => {
  const info = ref<SystemContext | null>(null)

  async function load() {
    const [err, data] = await api.get<SystemContext>('/api/context')
    if (!err) info.value = data
    return info.value
  }

  return { info, load }
})
