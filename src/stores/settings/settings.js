import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const titleBarText = ref('')
    const testLatency = ref({ url: 'http://www.gstatic.com/generate_204', timeout: 5000 })
    return { titleBarText, testLatency }
  },
  { persist: true },
)
