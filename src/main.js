import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/index.js'
import pinia from '@/stores/index.js'
import { i18n } from '@/plugins/i18n'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings/settings.js'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(i18n)
const { theme } = storeToRefs(useSettingsStore())
app.config.globalProperties.$theme = theme.value
app.mount('#app')
