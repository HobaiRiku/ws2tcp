import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/client'
import type { VersionInfo } from '@/api/types'

export const useVersionStore = defineStore('version', () => {
  const info = ref<VersionInfo | null>(null)

  async function load() {
    if (info.value) return info.value
    const [err, data] = await api.get<VersionInfo>('/api/version')
    if (!err) info.value = data
    return info.value
  }

  return { info, load }
})
