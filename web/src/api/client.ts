// 极简 fetch 封装。返回 [err, data] 元组以贴合项目编码风格 (避免 try/catch 蔓延到调用方)。

const TOKEN_KEY = 'ws2tcp.token'

export type ApiError = {
  status: number
  code: string
  message: string
}

export type ApiResult<T> = readonly [ApiError, null] | readonly [null, T]

export const tokenStore = {
  get(): string {
    return localStorage.getItem(TOKEN_KEY) ?? ''
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
  signal?: AbortSignal
}

function buildURL(path: string, query?: RequestOptions['query']): string {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue
    params.set(k, String(v))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/json'
  }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let body: BodyInit | undefined
  if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(opts.body)
  }

  let resp: Response
  try {
    resp = await fetch(buildURL(path, opts.query), {
      method: opts.method ?? 'GET',
      headers,
      body,
      signal: opts.signal
    })
  } catch (e) {
    return [{ status: 0, code: 'NETWORK_ERROR', message: (e as Error).message }, null] as const
  }

  if (resp.status === 204) {
    return [null, undefined as T] as const
  }

  const text = await resp.text()
  const parsed = text ? safeParseJSON(text) : null

  if (!resp.ok) {
    const err: ApiError = {
      status: resp.status,
      code: (parsed && (parsed as { code?: string }).code) || `HTTP_${resp.status}`,
      message:
        (parsed && (parsed as { message?: string }).message) ||
        resp.statusText ||
        'request failed'
    }
    return [err, null] as const
  }

  return [null, parsed as T] as const
}

function safeParseJSON(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) =>
    request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T = void>(path: string) => request<T>(path, { method: 'DELETE' })
}
