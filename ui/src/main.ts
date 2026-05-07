import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  provideFluentDesignSystem,
  allComponents
} from '@fluentui/web-components'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import './styles/main.css'

provideFluentDesignSystem().register(allComponents)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
