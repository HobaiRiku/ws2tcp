import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  provideFluentDesignSystem,
  allComponents
} from '@fluentui/web-components'
import App from './App.vue'
import router from './router'
import './styles/main.css'

provideFluentDesignSystem().register(allComponents)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
