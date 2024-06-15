import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/style.css'
import App from '@/App.vue'
import router from '@/router'

const pina = createPinia()

createApp(App).use(router).use(pina).mount('#app')
