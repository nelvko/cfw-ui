import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '@/plugins/i18n/index.js'
import storage from '@/hooks/storage.js'
import { watch } from 'vue'

const { t, locale } = i18n.global
const routes = [
  {
    path: '/',
    name: 'AppView',
    redirect: '/general',
    component: () => import('@/pages/AppView.vue'),
    children: [
      {
        path: 'general',
        name: 'General',
        component: () => import('@/pages/General.vue'),
        meta: { title: 'General' },
      },
      {
        path: 'proxies',
        name: 'Proxies',
        component: () => import('@/pages/Proxies.vue'),
        meta: { title: 'Proxies' },
      },
      {
        path: 'profiles',
        name: 'Profiles',
        component: () => import('@/pages/Profiles.vue'),
        meta: { title: 'Profiles' },
      },
      { path: 'logs', component: () => import('@/pages/Logs.vue'), meta: { title: 'Logs' } },
      {
        path: 'connections',
        name: 'Connections',
        component: () => import('@/pages/Connections.vue'),
        meta: { title: 'Connections' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Settings.vue'),
        meta: { title: 'Settings' },
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/pages/Feedback.vue'),
        meta: { title: 'Feedback' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      requiresAuth: false,
      title: 'login',
    },
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

router.afterEach(async (to) => {
  document.title = t(to.meta.title)
})

watch(locale, () => {
  document.title = t(router.currentRoute.value.meta.title)
})

export default router
