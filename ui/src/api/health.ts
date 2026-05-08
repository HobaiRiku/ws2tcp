// 后端探活: GET /api/health (无鉴权). 网络错误 / 5xx 视为 down,
// 4xx (含 401/403) 视为 up — 后端进程在跑, 只是路由层拒绝.
//
// 返回 [down, ok]:
//   down=true 表示进程不可达 (服务没起 / 端口不通 / 反代 502 / 网线拔了)
//   down=false 表示后端响应了, 即便业务层错误也算"活着"

import { request } from './client'

export type HealthOK = { ok: true }

export async function probeHealth(signal?: AbortSignal): Promise<{ down: boolean }> {
  const [err] = await request<HealthOK>('/api/health', { signal })
  if (!err) return { down: false }
  // status=0 是 fetch 抛错 (网络层); 5xx 我们也判 down.
  if (err.status === 0) return { down: true }
  if (err.status >= 500) return { down: true }
  return { down: false }
}
