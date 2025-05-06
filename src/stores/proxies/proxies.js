import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProxiesStore = defineStore('proxies', () => {
  const selectedProxy = ref(null)
  return { selectedProxy }
})

export const useConfigs = () => {
  const configs = ref({})
  return { configs }
}
