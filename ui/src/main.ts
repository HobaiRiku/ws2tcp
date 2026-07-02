import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  provideFluentDesignSystem,
  allComponents,
  baseLayerLuminance,
  fillColor,
  neutralLayer1,
  StandardLuminance
} from '@fluentui/web-components'
import App from './App.vue'
import { registerPWA } from './pwa'
import router from './router'
import { i18n } from './i18n'
import { onNetworkError } from './api/client'
import { useHealthStore } from './stores/health'
import './styles/main.css'

provideFluentDesignSystem().register(allComponents)

// Fluent 自定义元素的前景色由 fillColor 反推 (默认 fillColor=白 → 前景=近黑),
// 不跟随 prefers-color-scheme. 不同步的话 dark 模式下表单文字仍是黑色, 看不见.
// 把 baseLayerLuminance + fillColor 绑到系统主题, 组件内部配方就能算出对比正确的前景.
function syncFluentTheme(dark: boolean) {
  const root = document.body
  baseLayerLuminance.setValueFor(
    root,
    dark ? StandardLuminance.DarkMode : StandardLuminance.LightMode
  )
  // fillColor 绑到 luminance 感知的 neutralLayer1, 两种模式都能拿到匹配的底色.
  fillColor.setValueFor(root, neutralLayer1)
}

const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
syncFluentTheme(colorScheme.matches)
colorScheme.addEventListener('change', e => syncFluentTheme(e.matches))

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
