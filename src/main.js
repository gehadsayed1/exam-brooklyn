import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import emitter from './eventBus' 

const pinia = createPinia()
const app = createApp(App)

app.config.globalProperties.emitter = emitter 

app.use(router)
app.use(pinia)
app.mount('#app')
