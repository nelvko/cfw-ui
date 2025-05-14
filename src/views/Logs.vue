<script setup>
import { computed, onActivated, ref, useTemplateRef } from 'vue'
import TopInfo from '@/components/TopInfo.vue'
import { logs } from '@/api/ws.js'
import { getMode } from '@/api/configs.js'

const isSimple = ref(true)
const isInfo = ref(true)
const logList = ref([])

function parseLogLine(log) {
  const result = {}
  // 匹配基本字段
  const patterns = {
    type: /\[(.*?)]/,
    status: / (\w*) /,
    lAddr: /lAddr=([\d.]+:\d+)/,
    rAddr: /rAddr=([\w.-]+:\d+)/,
    mode: /mode=(\w+)/,
    rule: /rule=(\S+)/,
    proxy: /proxy=(.+)$/,
  }
  for (const key in patterns) {
    const match = log.match(patterns[key])
    if (match) {
      result[key] = match[1]
    }
  }
  return result
}

const activeMode = ref(null)

function onMessage({ data, timeStamp }) {
  const { payload, type } = JSON.parse(data)
  logList.value.push({
    raw: payload,
    type: type, //info
    data: parseLogLine(payload),
    timeStamp,
  })
}

onActivated(() => {
  console.log('onActivated')
  getMode().then((mode) => {
    activeMode.value = mode
  })
  isStop.value = false

  logs.onmessage = onMessage
  if (logList.value.length > 0) {
    logsBox.value.scrollTop = logsBox.value.scrollHeight
  }
})

function switchSimple() {
  isSimple.value = !isSimple.value
  if (isSimple.value) {
    filterLogList.value.forEach((item) => (item.isShowDetail = false))
  } else {
    filterLogList.value.forEach((item) => (item.isShowDetail = true))
  }
}

function switchInfo() {
  isInfo.value = !isInfo.value
}

const logsBox = useTemplateRef('logsBox')

function formatTimeStamp(timeStamp) {
  const navigationStart = performance.timing.navigationStart
  const date = new Date(navigationStart + timeStamp)
  return date.toLocaleTimeString({
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

const isStop = ref(false)

function stopLog() {
  isStop.value = !isStop.value
  if (isStop.value) {
    logs.onmessage = null
  } else {
    logs.onmessage = onMessage
  }
}

const keyword = ref('')

const filterLogList = computed(() =>
  logList.value.filter(
    (item) => item.type === 'info' && isInfo.value && item.raw.match(keyword.value),
  ),
)
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <TopInfo class="flex items-center gap-x-[16px] px-[20px]">
      <div class="whitespace-nowrap">
        <div class="text-[20px]">Request Logs</div>
        <div>mode: {{ activeMode }}</div>
      </div>
      <input
        type="text"
        placeholder="Search"
        v-model="keyword"
        class="h-[35px] flex-1 cursor-default rounded-[4px] pl-[12px]"
      />
      <div
        class="flex flex-col gap-y-[4px] text-center text-[14px] text-white *:flex *:h-[26px] *:w-[117px] **:[button]:bg-[#c7bfbf]"
      >
        <div @click="switchSimple">
          <button class="w-[46%] rounded-l-[7px]" :class="{ '!bg-blue-bg': isSimple }">
            Simple
          </button>
          <button class="w-[54%] rounded-r-[7px]" :class="{ '!bg-blue-bg': isSimple === false }">
            Detailed
          </button>
        </div>
        <div @click="switchInfo">
          <button
            class="w-[calc(50/117*100%)] rounded-l-[7px] duration-150 ease-linear"
            :class="{ '!bg-blue-bg': isInfo, 'w-[calc(65/117*100%)]': isInfo }"
          >
            info
          </button>
          <button
            class="w-[calc(52/117*100%)] rounded-r-[7px] duration-150 ease-linear"
            :class="{ '!bg-blue-bg': isInfo === false, 'w-[calc(67/117*100%)]': isInfo === false }"
          >
            debug
          </button>
        </div>
      </div>
      <div class="text-center text-white *:h-[30px] *:w-[70px] *:rounded-[3px]">
        <button class="mr-[8px] bg-[#2ca51d]" @click="logList.length = 0">Clear</button>
        <button :class="{ 'bg-[#f56363]': !isStop, 'bg-[#179bbb]': isStop }" @click="stopLog">
          {{ isStop ? 'Start' : 'Stop' }}
        </button>
      </div>
    </TopInfo>
    <div
      v-if="logList.length !== 0"
      ref="logsBox"
      class="mr-[3px] flex flex-1 flex-col overflow-y-auto"
      id="logs"
    >
      <div
        v-for="(item, index) in filterLogList"
        :key="index"
        class="height-[47px] mt-[2px] mr-[3px] cursor-pointer border-b-[1px] border-b-[#eaeaea] pl-[20px]"
        @click="item.isShowDetail = !item.isShowDetail"
      >
        <div class="flex justify-between">
          <span class="flex items-center justify-center">
            <span class="material-icons !text-[16px] text-[#77b255]"> check_box </span>
            <span class="text-[12px] text-[#13af42]">[TCP] connected</span>
          </span>

          <span class="mr-[10px] text-[12px] text-[#666]">{{
            formatTimeStamp(item.timeStamp)
          }}</span>
        </div>
        <div class="flex items-center justify-start">
          <span
            class="material-icons !text-[12px] text-[#999] transition"
            :class="{ 'rotate-90': item.isShowDetail }"
          >
            play_arrow
          </span>
          <span class="text-[14px]">{{ item.data.rAddr }}</span>
        </div>
        <div v-if="item.isShowDetail" class="flex text-[12px]">
          <div>
            <span class="text-[#045c85]">FROM</span>
            <span>-></span>
            <span class="text-[#333]">{{ item.data.lAddr }}</span>
          </div>
          <div class="ml-[12px]">
            <span class="text-[#045c85]">RULE</span>
            <span>-></span>
            <span class="text-[#333]">{{ item.data.rule }}</span>
          </div>
          <div class="ml-[12px]">
            <span class="text-[#045c85]">PROXY</span>
            <span>-></span>
            <span class="text-[#333]">{{ item.data.proxy }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="logList.length === 0"
      class="flex flex-1 cursor-default flex-col items-center justify-center text-[#808080]"
    >
      <span class="text-[18px]">Empty log list</span>
      <span class="text-[14px]">Refresh your browser to make requests.</span>
    </div>
  </div>
</template>

<style scoped></style>
