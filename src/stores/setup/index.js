import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSetupStore = defineStore(
  'setup',
  () => {
    const setupInfo = ref({
      host: '127.0.0.1:9090',
      secret: '',
    })
    const activeMenu = ref(0)

    return { setupInfo, activeMenu }
  },
  { persist: true },
)
