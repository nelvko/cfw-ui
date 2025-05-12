<script setup>
import TrafficView from '@/components/TrafficView.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopInfo from '@/components/TopInfo.vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSetupStore } from '@/stores/setup/index.js'

const { activeMenu } = storeToRefs(useSetupStore())

const { locale } = useI18n()

const router = useRouter()

const time = ref(null)

const menuList = ref([
  'General',
  'Proxies',
  'Rules',
  'Profiles',
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

function switchLanguage() {
  if (locale.value === 'cn') {
    locale.value = 'en'
  } else locale.value = 'cn'
}
</script>

<template>
  <div class="grey-bg flex h-full w-[170px] flex-col">
    <TopInfo>
      <traffic-view />
    </TopInfo>

    <div class="flex flex-col bg-white">
      <div
        class="grey-bg flex h-[57px] cursor-pointer items-center justify-center text-[#747d88]"
        :class="[
          { active: activeMenu === index },
          { topRadius: activeMenu === index - 1 },
          { bottomRadius: activeMenu === index + 1 },
        ]"
        @click="clickItem(index, item)"
        v-for="(item, index) in menuList"
        :key="index"
      >
        {{ $t(item) }}
      </div>
      <div
        class="grey-bg flex h-[57px] cursor-pointer items-center justify-center text-[#747d88]"
        @click="switchLanguage"
      >
        language
      </div>
    </div>
    <div class="mb-[14px] flex flex-1 flex-col items-center justify-end">
      <div class="bottom-[40px] text-[1em]">{{ time }}</div>
      <div class="flex items-center">
        <span class="material-icons">circle</span>
        <span style="font-size: 0.7em">Connected</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  color: #41b883;
  font-size: 16px;
}

.active {
  background-color: #fff;
  color: #000;
}

.topRadius {
  border-radius: 0 10px 0 0;
}

.bottomRadius {
  border-radius: 0 0 10px 0;
}
</style>
