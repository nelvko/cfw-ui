import { createRouter, createWebHistory } from 'vue-router'
import storage from '@/hooks/storage.js'

const routes = [
  {
    path: '/',
    redirect: '/general',
    component: () => import('@/pages/AppView.vue'),
    children: [
      { path: 'general', component: () => import('@/pages/General.vue') },
      { path: 'proxies', component: () => import('@/pages/Proxies.vue') },
      { path: 'profiles', component: () => import('@/pages/Profiles.vue') },
      { path: 'logs', component: () => import('@/pages/Logs.vue') },
      { path: 'connections', component: () => import('@/pages/Connections.vue') },
      { path: 'settings', component: () => import('@/pages/Settings.vue') },
      { path: 'feedback', component: () => import('@/pages/Feedback.vue') },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!storage.getLogin() && to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export default router
