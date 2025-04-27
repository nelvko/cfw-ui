<script setup>
import TopInfo from '@/components/TopInfo.vue'
import GreyButton from '@/components/GreyButton.vue'
import { computed, onActivated, ref } from 'vue'
import { useFormatSpeed } from '@/hooks/formatSpeed.js'
import { connections } from '@/api/ws.js'
import ToolTip from '@/components/ToolTip.vue'
import connectionss from '@/mock/connections.js'
const pause = ref(true)
const connectionList = ref([])
const downloadTotal = ref(0)
const uploadTotal = ref(0)
connections
onActivated(() => {
  connectionss
  downloadTotal.value = connectionss.downloadTotal
  uploadTotal.value = connectionss.uploadTotal
  connectionList.value = connectionss.connections
  // connections.onmessage = (event) => {
  //   const data = JSON.parse(event.data)
  //   console.log('📩 收到消息：', data)
  //   downloadTotal.value = data.downloadTotal
  //   uploadTotal.value = data.uploadTotal
  //   connectionList.value = data.connections
  // }
})
const upload = computed(() => {
  return useFormatSpeed(uploadTotal.value)
})
const download = computed(() => {
  return useFormatSpeed(downloadTotal.value)
})

function switchPause() {
  pause.value = !pause.value
}
</script>

<template>
  <!--  padding: 0 20px 0 16px -->
  <div class="flex h-full flex-col overflow-y-hidden">
    <TopInfo class="flex flex-col pr-[20px] pl-[16px]">
      <div class="my-[8px] flex">
        <div class="text-[18px]">Connections</div>
        <input placeholder="Search" type="text" />
        <div class="flex items-center">
          <span>Total:</span>
          <span class="material-icons up">straight</span>
          <span>{{ `${upload.num} ${upload.unit}` }}</span>
          <span class="material-icons down">straight</span>
          <span>{{ `${download.num} ${download.unit}` }}</span>
        </div>
      </div>
      <div class="flex justify-between">
        <div class="flex">
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
          <div :class="{ pause, resume: !pause }" @click="switchPause">
            {{ pause ? 'Pause' : 'Resume' }}
          </div>
          <div class="close-all">Close All（{{ connectionList.length }}）</div>
        </div>
      </div>
    </TopInfo>
    <div class="mr-[2px] flex flex-1 flex-col overflow-y-auto">
      <div v-for="item in connectionList" :key="item.id" class="connection">
        <div class="left">
          <div>{{ item.metadata.host }}:{{ item.metadata.destinationPort }}</div>
          <div class="metadata">
            <span style="background-color: #ce8647">{{ item.metadata.network.toUpperCase() }}</span>
            <span style="background-color: #cf9f46">{{ item.metadata.type }}</span>
            <span style="background-color: #75ab5b">{{ item.chains[0] }}</span>
            <span style="background-color: #428ee4">A few minutes ago</span>
          </div>
        </div>
        <span
          class="material-icons"
          style="margin-right: 23px; color: #333333; transform: rotateY(180deg)"
        >
          block
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.metadata > span {
  color: white;
  height: 21px;
  margin-right: 5px;
  font-size: 12px;
  line-height: 21px;
  padding: 1px 4px;
  box-sizing: border-box;
  border-radius: 4px;
}

.connection {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #ededed;
  margin-left: 20px;
}

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

.pause {
  /*width: 59px;*/
  margin-right: 10px;
}

.resume {
  background-color: #179bbb;
}

input {
  flex: 1;
}
</style>
