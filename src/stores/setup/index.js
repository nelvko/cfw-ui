import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSetupStore = defineStore(
  'setup',
  () => {
    const setupInfo = ref({
      host: '',
      port: '',
      secret: '',
    })
    const activeMenu = ref(0)

    return { setupInfo, activeMenu }
  },
  { persist: true },
)
