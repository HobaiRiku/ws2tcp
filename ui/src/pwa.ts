import type { Router } from 'vue-router'

const UPDATE_CHECK_INTERVAL_MS = 5 * 60 * 1000

let registered = false

function reloadPageOnce() {
  if (reloadPageOnce.done) return
  reloadPageOnce.done = true
  window.location.reload()
}

reloadPageOnce.done = false

function requestUpdate(registration?: ServiceWorkerRegistration | null) {
  if (!registration) return
  void registration.update().catch(error => {
    console.error('PWA update check failed', error)
  })
}

export function registerPWA(router: Router) {
  if (registered || import.meta.env.DEV || !('serviceWorker' in navigator)) return
  registered = true

  void router.isReady().then(async () => {
    const hadController = Boolean(navigator.serviceWorker.controller)

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return
      reloadPageOnce()
    })

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return
      void navigator.serviceWorker.getRegistration().then(requestUpdate)
    })

    const { registerSW } = await import('virtual:pwa-register')
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        void updateSW(true)
      },
      onRegisteredSW(_swUrl, registration) {
        requestUpdate(registration)
        window.setInterval(() => requestUpdate(registration), UPDATE_CHECK_INTERVAL_MS)
      },
      onRegisterError(error) {
        console.error('PWA registration failed', error)
      }
    })
  })
}
