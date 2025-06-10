import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Create Vue app instance
const app = createApp(App)

// Install plugins
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')