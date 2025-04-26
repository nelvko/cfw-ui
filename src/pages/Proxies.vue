<script setup>
import { onActivated, onDeactivated, onUnmounted, ref } from 'vue'
import DirectMode from '@/components/mode/DirectMode.vue'
import TopInfo from '@/components/TopInfo.vue'
import ProxyMode from '@/components/mode/ProxyMode.vue'

onUnmounted(() => {
  console.log('unmounted')
})
onActivated(() => {
  console.log('onActivated')
})
onDeactivated(() => {
  console.log('onDeactivated')
})
const activeMode = ref('')
const modeList = [
  { name: 'Global', icon: 'merge' },
  { name: 'Rule', icon: 'alt_route' },
  { name: 'Direct', icon: 'north' },
  { name: 'Script', icon: 'alt_route' },
]

const modeIndex = ref(0)

function switchMode(index) {
  modeIndex.value = index
  console.log(modeIndex.value)
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <TopInfo class="flex items-center justify-center">
      <div
        v-for="(item, index) in modeList"
        :key="index"
        :class="{ modeActive: modeIndex === index }"
        class="mode-item"
        @click="switchMode(index)"
      >
        <div>{{ item.name }}</div>
        <span class="material-icons">{{ item.icon }}</span>
      </div>
    </TopInfo>
    <div
      class="mt-[8px] flex flex-1 flex-col overflow-x-hidden overflow-y-auto pb-[66px]"
      id="proxies"
    >
      <ProxyMode v-if="[0, 1, 3].includes(modeIndex)" />
      <DirectMode v-if="modeIndex === 2" />
    </div>
  </div>
</template>

<style scoped>
.side {
  position: absolute;
  right: 0;
}

.material-icons {
  transform: rotate(90deg);
  margin-left: 7px;
}

.mode-item {
  margin: 0 20px;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 120px;
  color: #747474;
  cursor: pointer;
}

.mode-item * {
  cursor: pointer;
}

.modeActive {
  background-color: #4c4b4b;
  color: #fff;
}

/*.view {*/
/*  flex-grow: 1;*/
/*  !*height: 100%;*!*/
/*  overflow-y: auto;*/
/*  position: relative;*/
/*  !*padding-bottom: 70px*!*/
/*}*/
</style>
