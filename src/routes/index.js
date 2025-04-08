import {createMemoryHistory, createRouter} from 'vue-router'

import General from "@/pages/General.vue";
import Proxies from "@/pages/Proxies.vue";
import Profiles from "@/pages/Profiles.vue";
import Logs from "@/pages/Logs.vue";

const routes = [
  {path: '/', redirect: "/general"},
  {path: '/general', component: General},
  {path: '/proxies', component: Proxies},
  {path: '/profiles', component: Profiles},
  {path: '/logs', component: Logs},
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})