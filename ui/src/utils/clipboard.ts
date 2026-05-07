// Envelope used for ws2tcp 服务端配置在剪贴板里的传递格式. 客户端 endpoint
// 弹窗会自动检测剪贴板里的这种格式并预填表单, 让用户少手动抄字段.

export const SERVER_CONFIG_MAGIC = 'ws2tcp/server-config@v1'

export type ServerConfigEnvelope = {
  magic: typeof SERVER_CONFIG_MAGIC
  host: string
  port: number
  path: string
  wss: boolean
  aes_key: string
}

export function buildServerConfigEnvelope(input: {
  host: string
  port: number
  path: string
  wss: boolean
  aes_key: string
}): string {
  const env: ServerConfigEnvelope = {
    magic: SERVER_CONFIG_MAGIC,
    host: input.host,
    port: input.port,
    path: input.path,
    wss: input.wss,
    aes_key: input.aes_key
  }
  return JSON.stringify(env, null, 2)
}

export function parseServerConfigEnvelope(text: string): ServerConfigEnvelope | null {
  if (!text) return null
  try {
    const obj = JSON.parse(text)
    if (obj && typeof obj === 'object' && obj.magic === SERVER_CONFIG_MAGIC) {
      return obj as ServerConfigEnvelope
    }
  } catch {
    return null
  }
  return null
}

export async function readClipboardText(): Promise<string | null> {
  try {
    if (!navigator.clipboard?.readText) return null
    return await navigator.clipboard.readText()
  } catch {
    return null
  }
}

export async function writeClipboardText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// crypto.getRandomValues 给 32 字节; 用 base64-url 字母表填到 32 字符 (后端校验
// `len(key) == 32`, 所以这里产 32 个 ASCII 字符既满足校验又可读).
export function generateAesKey32(): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < 32; i++) out += alphabet[bytes[i] % alphabet.length]
  return out
}
