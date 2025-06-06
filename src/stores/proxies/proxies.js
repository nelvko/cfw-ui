import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProxiesStore = defineStore('proxies', () => {
  const selectedProxy = ref(null)
  return { selectedProxy }
})
