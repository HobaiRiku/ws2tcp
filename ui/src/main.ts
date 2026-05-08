import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  provideFluentDesignSystem,
  allComponents
} from '@fluentui/web-components'
import App from './App.vue'
import { registerPWA } from './pwa'
import router from './router'
import { i18n } from './i18n'
import { onNetworkError } from './api/client'
import { useHealthStore } from './stores/health'
import './styles/main.css'

provideFluentDesignSystem().register(allComponents)

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)
registerPWA(router)

// pinia 装上后才能拿到 store 实例.
const health = useHealthStore(pinia)
onNetworkError(() => {
  if (health.status === 'down') return
  health.markDown()
  // 当前路由不是 backend-down 才跳, 否则会触发自循环.
  if (router.currentRoute.value.name !== 'backend-down') {
    router.replace({
      name: 'backend-down',
      query: { redirect: router.currentRoute.value.fullPath }
    })
  }
})

app.mount('#app')
