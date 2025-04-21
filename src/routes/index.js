import { createRouter, createWebHistory } from 'vue-router'
import General from '@/pages/General.vue'
import Proxies from '@/pages/Proxies.vue'
import Profiles from '@/pages/Profiles.vue'
import Logs from '@/pages/Logs.vue'
import Connections from '@/pages/Connections.vue'
import Settings from '@/pages/Settings.vue'
import Feedback from '@/pages/Feedback.vue'
import Login from '@/pages/Login.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/general', component: General },
  { path: '/proxies', component: Proxies },
  { path: '/profiles', component: Profiles },
  { path: '/logs', component: Logs },
  { path: '/connections', component: Connections },
  { path: '/settings', component: Settings },
  { path: '/feedback', component: Feedback },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
