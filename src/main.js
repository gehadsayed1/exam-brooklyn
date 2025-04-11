import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import mitt from 'mitt' 

const emitter = mitt()

const pinia = createPinia()
const app = createApp(App)


app.provide('emitter', emitter) // Provide the event bus to the entire app
app.use(router)
app.use(pinia)
app.mount('#app')
