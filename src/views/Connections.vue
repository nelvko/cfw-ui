<script setup>
import TopInfo from '@/components/TopInfo.vue'
import GreyButton from '@/components/GreyButton.vue'
import { computed, onActivated, ref } from 'vue'
import { useFormatSpeed } from '@/hooks/formatSpeed.js'
import ToolTip from '@/components/ToolTip.vue'
import { closeAllConnections, closeConnection } from '@/api/common.js'
import { connections } from '@/api/ws.js'

const isPause = ref(false)
const connectionList = ref([])
const downloadTotal = ref(0)
const uploadTotal = ref(0)

function onMessage(event) {
  const data = JSON.parse(event.data)
  // console.log('📩 收到消息：', data)
  downloadTotal.value = data.downloadTotal
  uploadTotal.value = data.uploadTotal
  connectionList.value = data.connections
}
onActivated(() => {
  connections.onmessage = onMessage
})

const upload = computed(() => {
  return useFormatSpeed(uploadTotal.value, 1)
})
const download = computed(() => {
  return useFormatSpeed(downloadTotal.value, 1)
})

function switchPause() {
  isPause.value = !isPause.value
  console.log(123, isPause.value)

  if (isPause.value) {
    connections.onmessage = null
  } else {
    connections.onmessage = onMessage
  }
}
</script>

<template>
  <!--  padding: 0 20px 0 16px -->
  <div class="flex h-full flex-col overflow-y-hidden">
    <TopInfo class="flex flex-col pr-[20px] pl-[16px]">
      <div class="my-[8px] flex">
        <div class="mr-[5px] text-[18px]">Connections</div>
        <input placeholder="Search" type="text" class="flex-1 cursor-default" />
        <div class="flex items-center">
          <span>Total:</span>
          <span class="material-icons up">straight</span>
          <span>{{ `${upload.num} ${upload.unit}` }}</span>
          <span class="material-icons down">straight</span>
          <span>{{ `${download.num} ${download.unit}` }}</span>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex gap-x-[5px]">
          <ToolTip dark tip="Upload Speed" top>
            <GreyButton>
              <span class="material-icons">upload</span>
              <span class="material-icons">speed</span>
            </GreyButton>
          </ToolTip>

          <ToolTip dark tip="Download Speed" top>
            <GreyButton>
              <span class="material-icons">download</span>
              <span class="material-icons">speed</span>
            </GreyButton>
          </ToolTip>

          <ToolTip dark tip="Upload Traffic" top>
            <GreyButton>
              <span class="material-icons">upload</span>
              <span class="material-icons">signal_cellular_alt</span>
            </GreyButton>
          </ToolTip>

          <ToolTip dark tip="Download Traffic" top>
            <GreyButton>
              <span class="material-icons">download</span>
              <span class="material-icons">signal_cellular_alt</span>
            </GreyButton>
          </ToolTip>

          <ToolTip dark tip="Start Time" top>
            <GreyButton>
              <span class="material-icons">schedule</span>
            </GreyButton>
          </ToolTip>

          <ToolTip dark tip="Destination" top>
            <GreyButton>
              <span class="material-icons">laptop_windows</span>
            </GreyButton>
          </ToolTip>
        </div>
        <div class="flex">
          <div :class="{ pause: !isPause, resume: isPause }" @click="switchPause">
            {{ isPause ? 'Resume' : 'Pause' }}
          </div>
          <div class="close-all ml-[10px]" @click="closeAllConnections()">
            Close All（{{ connectionList.length }}）
          </div>
        </div>
      </div>
    </TopInfo>
    <div class="mr-[2px] flex flex-1 flex-col overflow-y-auto">
      <div
        v-for="item in connectionList"
        :key="item.id"
        class="ml-[20px] flex h-[50px] items-center justify-between border-b border-b-[#ededed]"
      >
        <div class="flex flex-col justify-center">
          <div class="text-[14px]">
            {{ item.metadata.host }}:{{ item.metadata.destinationPort }}
          </div>
          <div
            class="pb-[3px] text-[12px] *:mr-[5px] *:h-[20.5px] *:rounded-[3px] *:px-[4px] *:py-[1px] *:text-white"
          >
            <span class="bg-[#ce8647]">{{ item.metadata.network.toUpperCase() }}</span>
            <span class="bg-[#cf9f46]">{{ item.metadata.type }}</span>
            <span class="bg-[#75ab5b]">{{ item.chains[0] }}</span>
            <span class="bg-[#428ee4]">A few minutes ago</span>
          </div>
        </div>
        <span
          class="material-icons"
          style="margin-right: 23px; color: #333333"
          v-show="!isPause"
          @click="closeConnection(item.id)"
        >
          block
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pause,
.close-all,
.resume {
  font-size: 14px;
  border-radius: 3px;
  height: 28px;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #f56363;
  color: white;
  text-align: center;
  line-height: 28px;
  cursor: pointer;
}
.up,
.down {
  font-size: 18px;
  margin-right: -5px;
}

.down {
  transform: rotate(180deg);
}

.resume {
  background-color: #179bbb;
}
</style>
