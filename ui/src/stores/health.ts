// 后端可达性 store. 三个状态:
//   unknown — 尚未探测过 (启动初始)
//   ok      — 上次探测成功
//   down    — 上次探测失败, BackendDown 页面会接管
//
// 探测来源:
//   1) router.beforeEach 在首次进入业务路由前调一次 ensure()
//   2) BackendDown 页面挂载后周期性调 retryUntilUp()
//   3) runtime store 的轮询失败 (NETWORK_ERROR) 会调 markDown()
// 这三处协作, 不需要常驻定时器 — 后端正常时基本无开销.

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { probeHealth } from '@/api/health'

export type HealthStatus = 'unknown' | 'ok' | 'down'

const RETRY_INTERVAL_MS = 2000

export const useHealthStore = defineStore('health', () => {
  const status = ref<HealthStatus>('unknown')
  const lastCheckedAt = ref<number>(0)

  let inflight: Promise<HealthStatus> | null = null
  let retryTimer: number | null = null

  async function probe(): Promise<HealthStatus> {
    if (inflight) return inflight
    inflight = (async () => {
      const { down } = await probeHealth()
      lastCheckedAt.value = Date.now()
      status.value = down ? 'down' : 'ok'
      return status.value
    })()
    try {
      return await inflight
    } finally {
      inflight = null
    }
  }

  // 路由守卫用: 状态未知时强制探测一次, 已知则直接返回缓存值.
  async function ensure(): Promise<HealthStatus> {
    if (status.value !== 'unknown') return status.value
    return probe()
  }

  function markDown() {
    status.value = 'down'
    lastCheckedAt.value = Date.now()
  }

  function startRetry(onRecover: () => void) {
    if (retryTimer !== null) return
    const tick = async () => {
      const next = await probe()
      if (next === 'ok') {
        stopRetry()
        onRecover()
        return
      }
      retryTimer = window.setTimeout(tick, RETRY_INTERVAL_MS)
    }
    retryTimer = window.setTimeout(tick, RETRY_INTERVAL_MS)
  }

  function stopRetry() {
    if (retryTimer !== null) {
      window.clearTimeout(retryTimer)
      retryTimer = null
    }
  }

  return {
    status,
    lastCheckedAt,
    probe,
    ensure,
    markDown,
    startRetry,
    stopRetry
  }
})
