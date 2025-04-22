import { createMemoryHistory, createRouter } from 'vue-router'
import General from '@/pages/General.vue'
import Proxies from '@/pages/Proxies.vue'
import Profiles from '@/pages/Profiles.vue'
import Logs from '@/pages/Logs.vue'
import Connections from '@/pages/Connections.vue'
import Settings from '@/pages/Settings.vue'
import Feedback from '@/pages/Feedback.vue'
import AppView from '@/pages/AppView.vue'

const routes = [
  {
    path: '/',
    redirect: '/general',
    component: AppView,
    children: [
      { path: '/general', component: General },
      { path: '/proxies', component: Proxies },
      { path: '/profiles', component: Profiles },
      { path: '/logs', component: Logs },
      { path: '/connections', component: Connections },
      { path: '/settings', component: Settings },
      { path: '/feedback', component: Feedback }],
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export default router