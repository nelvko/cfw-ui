import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const titleBarText = ref('')
    return { titleBarText }
  },
  { persist: true }
)
