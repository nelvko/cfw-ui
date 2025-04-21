<script setup>
import { ref } from 'vue'
import GlobalMode from '@/components/mode/GlobalMode.vue'
import RuleMode from '@/components/mode/RuleMode.vue'
import DirectMode from '@/components/mode/DirectMode.vue'
import TopInfo from '@/components/TopInfo.vue'

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
  <div class="proxies">
    <TopInfo class="mode">
      <!--      <div class="mode">-->
      <div
        v-for="(item, index) in modeList"
        :key="index"
        @click="switchMode(index)"
        :class="{ modeActive: modeIndex === index }"
        class="mode-item"
      >
        <div>{{ item.name }}</div>
        <span class="material-symbols-outlined">{{ item.icon }}</span>
      </div>
      <!--      </div>-->
    </TopInfo>
    <div style="height: 100%; display: flex; flex-direction: column">
      <div style="height: 8px; background-color: white" />
      <div class="view">
        <GlobalMode v-if="modeIndex === 0" />
        <RuleMode v-if="modeIndex === 1" />
        <DirectMode v-if="modeIndex === 2" />
        <div v-if="modeIndex === 3">script</div>
      </div>
      <div style="height: 70px; background-color: white" />
    </div>
  </div>
</template>

<style scoped>
.side {
  position: absolute;
  right: 0;
}

.proxies {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.material-symbols-outlined {
  transform: rotate(90deg);
  margin-left: 7px;
}

.mode {
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100%;*/
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

.view {
  flex-grow: 1;
  /*height: 100%;*/
  overflow-y: auto;
  position: relative;
  /*padding-bottom: 70px*/
}
</style>
