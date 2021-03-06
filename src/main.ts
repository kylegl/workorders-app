import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import vSelect from 'vue-select'
import routes from 'virtual:generated-pages'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

(async () => {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('~/mocks/browser')
    worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
})()

const app = createApp(App)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
app.component('v-select', vSelect)
app.use(router)
app.use(createPinia())
app.mount('#app')

