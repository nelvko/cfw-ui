import {createMemoryHistory, createRouter} from 'vue-router'

import General from "@/pages/General.vue";
import Proxies from "@/pages/Proxies.vue";

const routes = [
  {path: '/', component: General},
  {path: '/general', redirect: '/'},
  {path: '/proxies', component: Proxies},
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})