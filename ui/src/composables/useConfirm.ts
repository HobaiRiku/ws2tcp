import { reactive } from 'vue'

type ConfirmOptions = {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

type State = {
  open: boolean
  options: Required<Pick<ConfirmOptions, 'message'>> & ConfirmOptions
  resolve?: (ok: boolean) => void
}

const state = reactive<State>({
  open: false,
  options: { message: '' }
})

export function useConfirm() {
  function ask(options: ConfirmOptions): Promise<boolean> {
    state.options = options
    state.open = true
    return new Promise<boolean>(resolve => {
      state.resolve = resolve
    })
  }

  function close(ok: boolean) {
    state.open = false
    state.resolve?.(ok)
    state.resolve = undefined
  }

  return { state, ask, close }
}
