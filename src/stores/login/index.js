import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore(
  'login',
  () => {
    const loginInfo = ref(1)
    const activeMenu = ref(0)

    return { loginInfo, activeMenu }
  },
  { persist: true }
)
