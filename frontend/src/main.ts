import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://48h.sayzx.fr:30090'
console.info(`[BeeFootFlow] Front started (mode: ${import.meta.env.MODE}) - API: ${apiBaseUrl}`)

const app = createApp(App)
app.use(router)
app.mount('#app')
