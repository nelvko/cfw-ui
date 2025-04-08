import {defineStore} from "pinia";
import {ref} from "vue";

export const useProxiesStore = defineStore('proxies', () => {
  const proxies = ref(null)
  const providers = ref(null)
  const selectedProxy = ref(null)
  return {proxies, providers, selectedProxy}
})