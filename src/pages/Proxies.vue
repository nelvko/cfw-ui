<script setup>
import { onActivated, onDeactivated, onUnmounted, ref } from 'vue'
import DirectMode from '@/components/mode/DirectMode.vue'
import TopInfo from '@/components/TopInfo.vue'
import ProxyMode from '@/components/mode/ProxyMode.vue'
import { getMode, updateMode } from '@/api/configs.js'

onUnmounted(() => {
  console.log('unmounted')
})
onActivated(() => {
  console.log('onActivated')
})
onDeactivated(() => {
  console.log('onDeactivated')
})
const modeList = [
  { name: 'Global', value: 'global', icon: 'merge' },
  { name: 'Rule', value: 'rule', icon: 'alt_route' },
  { name: 'Direct', value: 'direct', icon: 'north' },
  { name: 'Script', icon: 'alt_route' },
]

const activeMode = ref(null)
getMode().then((mode) => {
  activeMode.value = mode
})

async function switchMode(val) {
  await updateMode(val)
  activeMode.value = await getMode()
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <TopInfo class="flex items-center justify-center">
      <div
        v-for="(item, index) in modeList"
        :key="index"
        :class="{ 'active-mode': activeMode === item.value }"
        class="mx-[20px] flex h-[40px] w-[120px] cursor-pointer items-center justify-center rounded-[5px] text-[16px] text-[#747474] shadow"
        @click="switchMode(item.name)"
      >
        <div>{{ item.name }}</div>
        <span class="material-icons">{{ item.icon }}</span>
      </div>
    </TopInfo>
    <div
      class="mt-[8px] mr-[3px] flex flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[66px]"
      id="proxies"
    >
      <DirectMode v-if="activeMode === 'direct'" />
      <ProxyMode v-else :mode="activeMode" />
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  transform: rotate(90deg);
  margin-left: 7px;
}

.active-mode {
  background-color: #4c4b4b;
  color: #fff;
}
</style>
