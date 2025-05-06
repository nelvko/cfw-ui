import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore(
  'login',
  () => {
    const loginInfo = ref({
      host: '127.0.0.1:9090',
      secret: '',
    })
    const activeMenu = ref(0)

    return { loginInfo, activeMenu }
  },
  { persist: true }
)
