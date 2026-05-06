import { reactive } from 'vue'

export type ToastKind = 'success' | 'error' | 'info'
export type Toast = { id: number; kind: ToastKind; message: string }

const state = reactive<{ items: Toast[] }>({ items: [] })
let nextId = 1

const durations: Record<ToastKind, number> = {
  success: 3000,
  info: 3000,
  error: 5000
}

function push(kind: ToastKind, message: string) {
  const id = nextId++
  state.items.push({ id, kind, message })
  window.setTimeout(() => dismiss(id), durations[kind])
}

function dismiss(id: number) {
  const idx = state.items.findIndex(it => it.id === id)
  if (idx >= 0) state.items.splice(idx, 1)
}

export function useToast() {
  return {
    state,
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
    info: (m: string) => push('info', m),
    dismiss
  }
}
