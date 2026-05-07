import { onBeforeUnmount, onMounted } from 'vue'

// useAutoRefresh: 在组件挂载期间周期性地调用 fn。第一次刷新由组件 onMounted
// 自己触发,这里只负责后续的间隔轮询,以避免页面进入时出现两次并发请求。
export function useAutoRefresh(fn: () => void | Promise<void>, intervalMs = 5000) {
  let timer: number | null = null

  onMounted(() => {
    timer = window.setInterval(() => {
      fn()
    }, intervalMs)
  })

  onBeforeUnmount(() => {
    if (timer !== null) {
      window.clearInterval(timer)
      timer = null
    }
  })
}
