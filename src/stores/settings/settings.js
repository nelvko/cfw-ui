import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const titleBarText = ref('')
    const testLatency = ref({ url: 'http://www.gstatic.com/generate_204', timeout: 5000 })

    const theme = ref(null)

    const lightTheme = ref({
      windowBar: ['bg-[#343442]'],
    })

    const darkTheme = ref({
      windowBar: ['bg-[#ebebeb]'],
    })

    const festivalTheme = ref({
      windowBar: ['bg-[#e8a84a]'],
    })

    const cyberTheme = ref({
      input: ['border-[#0c7a97]'],
      windowBar: ['bg-[#fcec0c]'],
      traffic: ['text-[#fcec0c]'],
      sideMenu: {
        select: ['bg-[#084a5a]', 'text-[#c79707]'],
        selected: ['bg-[#136377]', 'text-[#fcec0c]'],
        connection: ['text-[#fcec0c]'],
      },
      main: [
        'bg-[#136377]',
        'text-[#fcec0c]',
        // 'bg-[url("@/assets/static/imgs/2077.png")]',
        'bg-no-repeat',
      ],
      optionItem: ['hover:bg-[#084a5a]'],
      settingItem: ['bg-[#084a5a]'],
      card: ['bg-[#09718b]'],
      proxies: {
        mode: ['bg-[#58482c]', 'text-[#c5c5c5]'],
        activeMode: ['bg-[#dfd43f]', 'text-black'],
        select: ['bg-[#0d4e63]'],
        selected: ['bg-[#f8ed53]'],
      },
    })
    theme.value = cyberTheme.value

    return { titleBarText, testLatency, theme }
  },
  { persist: true },
)
