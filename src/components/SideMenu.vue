<script setup>
import TrafficView from '@/components/TrafficView.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import TopInfo from '@/components/TopInfo.vue'
import { storeToRefs } from 'pinia'
import { useSetupStore } from '@/stores/setup/index.js'
import { switchLanguage } from '@/hooks/switchLanguage.js'

const { activeMenu } = storeToRefs(useSetupStore())

const router = useRouter()

const time = ref(null)

const menuList = ref([
  'General',
  'Proxies',
  'Profiles',
  'Rules',
  'Logs',
  'Connections',
  'Settings',
  'Feedback',
])

let updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  time.value = `${hours} : ${minutes} : ${seconds}`
}
setInterval(updateTime, 1000)

const clickItem = (index, item) => {
  activeMenu.value = index
  router.push({ name: item })
}

import { getCurrentInstance } from 'vue'

const { appContext } = getCurrentInstance()
const theme = appContext.config.globalProperties.$theme

const active = computed(() => {
  return theme.sideMenu.selected
})
</script>

<template>
  <div class="flex h-full w-[170px] flex-col" :class="$theme.sideMenu.select">
    <TopInfo>
      <traffic-view />
    </TopInfo>

    <div class="flex flex-col">
      <div
        class="flex h-[57px] cursor-pointer items-center justify-center"
        :class="[
          activeMenu === index ? active : $theme.sideMenu.select,
          { topRadius: activeMenu === index - 1 },
          { bottomRadius: activeMenu === index + 1 },
        ]"
        @click="clickItem(index, item)"
        v-for="(item, index) in menuList"
        :key="index"
      >
        {{ $t(item) }}
      </div>
      <div class="flex h-[57px] cursor-pointer items-center justify-center" @click="switchLanguage">
        {{ $t('Language') }}
      </div>
    </div>
    <div
      class="mb-[14px] flex flex-1 flex-col items-center justify-end"
      :class="$theme.sideMenu.connection"
    >
      <div class="bottom-[40px] text-[1em]">{{ time }}</div>
      <div class="flex items-center">
        <span class="material-icons">circle</span>
        <span style="font-size: 0.7em">{{ $t('Connected') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  color: #41b883;
  font-size: 16px;
}

.topRadius {
  border-radius: 0 10px 0 0;
}

.bottomRadius {
  border-radius: 0 0 10px 0;
}
</style>
