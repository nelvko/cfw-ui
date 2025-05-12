import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '@/plugins/i18n/index.js'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSetupStore } from '@/stores/setup/index.js'

const { t, locale } = i18n.global

const routes = [
  {
    path: '/',
    component: () => import('@/pages/Layout.vue'),
    redirect: '/general',
    children: [
      {
        path: 'general',
        name: 'General',
        component: () => import('@/pages/General.vue'),
        meta: { title: 'General', requiresAuth: true },
      },
      {
        path: 'proxies',
        name: 'Proxies',
        component: () => import('@/pages/Proxies.vue'),
        meta: {
          title: 'Proxies',
          requiresAuth: true,
        },
      },
      {
        path: 'profiles',
        name: 'Profiles',
        component: () => import('@/pages/Profiles.vue'),
        meta: { title: 'Profiles', requiresAuth: true },
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/pages/Logs.vue'),
        meta: { title: 'Logs', requiresAuth: true },
      },
      {
        path: 'connections',
        name: 'Connections',
        component: () => import('@/pages/Connections.vue'),
        meta: { title: 'Connections', requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/Settings.vue'),
        meta: { title: 'Settings', requiresAuth: true },
      },
      {
        path: 'feedback',
        name: 'Feedback',
        component: () => import('@/pages/Feedback.vue'),
        meta: { title: 'Feedback', requiresAuth: true },
      },
    ],
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/pages/Setup.vue'),
    meta: { requiresAuth: false, title: 'Setup' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const { setupInfo } = storeToRefs(useSetupStore())
  if (!setupInfo.value?.host && to.name !== 'Setup') {
    return { name: 'Setup' }
  }
})

router.afterEach(async (to) => {
  document.title = t(to.meta.title)
})

watch(locale, () => {
  document.title = t(router.currentRoute.value.meta.title)
})

export default router
