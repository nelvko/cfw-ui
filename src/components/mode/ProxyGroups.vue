<script setup>
import { storeToRefs } from 'pinia'
import { getDelay, updateSelectedProxy } from '@/api/proxies.js'
import { ref } from 'vue'
import ToolTip from '@/components/ToolTip.vue'
import { useProxiesStore } from '@/stores/proxies/proxies.js'
defineProps({
  groupName: String,
  providers: Object,
})
const { selectedProxy } = storeToRefs(useProxiesStore())

const isShow = ref(false)

function selectProxy(name) {
  selectedProxy.value = name
  updateSelectedProxy(name)
}

function delay(name) {
  getDelay(name).then((res) => {
    console.log(111, res.data)
  })
}
</script>

<template>
  <div class="relative flex flex-col bg-white">
    <div
      class="sticky top-0 mr-[20px] mb-[4px] ml-[30px] flex h-[44px] items-center justify-between rounded-[5px] bg-white pr-[10px] hover:bg-[#f1f1f1]"
      @click="isShow = !isShow"
    >
      <div class="flex items-center">
        <div class="mr-[9px] ml-[10px] tracking-[1px]">{{ groupName }}</div>
        <div
          class="mr-[3px] flex h-[15px] w-[13.5px] items-center justify-center rounded-[3px] bg-[#41b883] text-[10px] text-white"
        >
          S
        </div>
        <div class="ml-[7px] text-[13px]">{{ selectedProxy }}</div>
      </div>
      <div class="flex items-center justify-center">
        <ToolTip dark tip="Scroll to selected proxy" top v-if="isShow">
          <span class="material-icons">travel_explore</span>
        </ToolTip>
        <ToolTip dark tip="Show/Hide timed-out proxies" top>
          <span class="material-icons">report</span>
        </ToolTip>
        <ToolTip dark tip="Test latency" top>
          <span class="material-icons">network_check</span>
        </ToolTip>
        <template v-if="groupName !== 'GLOBAL'">
          <ToolTip dark left tip="Show/hide proxies" v-if="!isShow">
            <span class="material-icons">visibility_off</span>
          </ToolTip>
          <ToolTip dark left tip="Show/hide proxies" v-if="isShow">
            <span class="material-icons">visibility</span>
          </ToolTip>
        </template>
      </div>
    </div>
    <div
      class="ml-[36px] flex flex-1 flex-wrap gap-x-[12px] gap-y-[8px] overflow-y-auto"
      v-if="isShow || groupName === 'GLOBAL'"
    >
      <div
        v-for="item in providers?.proxies"
        :key="item.id"
        class="flex h-[56px] cursor-pointer items-center justify-center"
        @click="selectProxy(item.name)"
      >
        <div
          class="mr-[4px] h-[56px] w-[4px] cursor-pointer bg-[#dedede]"
          :class="{ selected: item.name === selectedProxy }"
        />

        <div class="flex h-[56px] w-[382px] cursor-pointer justify-between bg-[#f4f4f4]">
          <div class="ml-[15px] flex flex-col justify-center">
            <div>{{ item.name }}</div>
            <div class="flex">
              <div class="text-[0.6em] text-[#808080]">
                {{ item.type }}
              </div>
              <div
                class="ml-[6px] flex h-[16px] w-[28px] items-center justify-center rounded-[3px] border-[1px] border-solid border-[#d5d5d5] text-[0.3em] text-[#808080]"
                v-if="item.udp"
              >
                UDP
              </div>
            </div>
          </div>
          <div class="mr-[15px] flex items-center" @click="delay(encodeURIComponent(item.name))">
            check
          </div>
        </div>
      </div>
      <div class="h-[30px] bg-pink-500"></div>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  font-size: 16px;
  @apply flex h-[30px] w-[30px] items-center justify-center rounded-[5px] hover:bg-[#d6d6d6];
}

.selected {
  background-color: #41b883;
}
</style>
