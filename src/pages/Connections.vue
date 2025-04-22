<script setup>
import TopInfo from '@/components/TopInfo.vue'
import GreyButton from '@/components/GreyButton.vue'
import { computed, onMounted, ref } from 'vue'
import { useFormatSpeed } from '@/hooks/formatSpeed.js'
import { connections } from '@/api/ws.js'

const pause = ref(true)
const connectionList = ref([])
const downloadTotal = ref(0)
const uploadTotal = ref(0)
onMounted(() => {
  connections.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // console.log('📩 收到消息：', data)
    downloadTotal.value = data.downloadTotal
    uploadTotal.value = data.uploadTotal
    connectionList.value = data.connections
  }
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
  <TopInfo style="display: flex; flex-direction: column; padding: 0 20px 0 16px">
    <div style="display: flex; margin: 8px 0">
      <div style="font-size: 18px">Connections</div>
      <input type="text" placeholder="Search" />
      <div style="display: flex; align-items: center">
        <span>Total:</span>
        <span class="material-symbols-outlined up">straight</span>
        <span>{{ `${upload.num} ${upload.unit}` }}</span>
        <span class="material-symbols-outlined down">straight</span>
        <span>{{ `${download.num} ${download.unit}` }}</span>
      </div>
    </div>
    <div class="buttons">
      <div style="display: flex">
        <GreyButton>
          <span class="material-symbols-outlined">upload_2</span>
          <span class="material-symbols-outlined">speed</span>
        </GreyButton>
        <GreyButton>
          <span class="material-symbols-outlined">download_2</span>
          <span class="material-symbols-outlined">speed</span>
        </GreyButton>
        <GreyButton>
          <span class="material-symbols-outlined">upload_2</span>
          <span class="material-symbols-outlined">signal_cellular_alt</span>
        </GreyButton>
        <GreyButton>
          <span class="material-symbols-outlined">download_2</span>
          <span class="material-symbols-outlined">signal_cellular_alt</span>
        </GreyButton>
        <GreyButton>
          <span class="material-symbols-outlined">schedule</span>
        </GreyButton>
        <GreyButton>
          <span class="material-symbols-outlined">laptop_windows</span>
        </GreyButton>
      </div>
      <div style="display: flex">
        <div @click="switchPause" :class="{ pause, resume: !pause }">
          {{ pause ? 'Pause' : 'Resume' }}
        </div>
        <div class="close-all">Close All（{{ connectionList.length }}）</div>
      </div>
    </div>
  </TopInfo>
  <div style="display: flex; flex-direction: column">
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
        class="material-symbols-outlined"
        style="margin-right: 23px; color: #333333; transform: rotateY(180deg)"
      >
        block
      </span>
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

.buttons {
  display: flex;
  justify-content: space-between;
}

input {
  flex: 1;
}
</style>
