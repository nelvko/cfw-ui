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

const mode = ref(null)

function onMessage({ data, timeStamp }) {
  const { payload, type } = JSON.parse(data)
  logList.value.push({
    id: crypto.randomUUID(),
    raw: payload,
    type: type, //info
    data: parseLogLine(payload),
    timeStamp,
  })
}

onActivated(() => {
  console.log('onActivated')
  getMode().then((mode) => {
    mode.value = mode
  })
  isStop.value = false

  logs.onmessage = onMessage
  if (logList.value.length > 0) {
    logsBox.value.scrollTop = logsBox.value.scrollHeight
  }
})

function switchLogSimple() {
  isSimple.value = !isSimple.value
  if (isSimple.value) {
    showLAddrList.value.length = 0
  } else {
    logList.value.forEach((item) => {
      showLAddrList.value.push(item.id)
    })
  }
}

function switchLogInfo() {
  isInfo.value = !isInfo.value
}

const logsBox = useTemplateRef('logsBox')

function formatTimeStamp(timeStamp) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  return formatter.format(timeStamp)
}

const showLAddrList = ref([])
const isStop = ref(false)

function stopLog() {
  isStop.value = !isStop.value
  if (isStop.value) {
    logs.onmessage = null
  } else {
    logs.onmessage = onMessage
  }
}

function changeShowLAddrList(id) {
  const index = showLAddrList.value.indexOf(id)
  if (index === -1) {
    showLAddrList.value.push(id)
  } else {
    showLAddrList.value.splice(index, 1)
  }
}

const keyword = ref('')

// watch(keyword.value, (newVal) => {})
const filterLogList = computed(() => {
  const a = logList.value.filter(
    (item) => item.type === 'info' && isInfo.value && item.raw.match(keyword.value)
  )
  console.log(a)

  return a
})
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <TopInfo class="flex items-center">
      <div class="ml-[21px] whitespace-nowrap">
        <div class="text-[20px]">Request Logs</div>
        <div>mode: {{ mode }}</div>
      </div>
      <input type="text" placeholder="Search" v-model="keyword" class="cursor-default" />
      <div class="button">
        <div class="level-group">
          <div class="level" @click="switchLogSimple">
            <div class="simple" :class="{ blue: isSimple }" style="width: 46%">Simple</div>
            <div class="detailed" :class="{ blue: isSimple === false }" style="width: 54%">
              Detailed
            </div>
          </div>
          <div class="level" @click="switchLogInfo">
            <div class="info duration-150 ease-linear" :class="{ blue: isInfo, infoLong: isInfo }">
              info
            </div>
            <div
              class="debug duration-150 ease-linear"
              :class="{ blue: isInfo === false, debugLong: isInfo === false }"
            >
              debug
            </div>
          </div>
        </div>
        <div class="clear" @click="logList.length = 0">Clear</div>
        <div :class="{ stop: !isStop, start: isStop }" @click="stopLog">
          {{ isStop ? 'Start' : 'Stop' }}
        </div>
      </div>
    </TopInfo>
    <div
      v-if="logList.length !== 0"
      ref="logsBox"
      class="mr-[2px] flex flex-1 flex-col overflow-y-auto"
      id="logs"
    >
      <div
        v-for="item in filterLogList"
        :key="item.id"
        class="height-[47px] mt-[2px] mr-[3px] !cursor-pointer border-b-[1px] border-b-[#eaeaea] pl-[20px]"
        @click="changeShowLAddrList(item.id)"
      >
        <div class="flex justify-between" style="font-size: 12px">
          <span class="flex items-center justify-center">
            <span class="material-icons text-[#77b255]" style="font-size: 18px"> check_box </span>
            <span class="text-[#13af42]">[TCP] connected</span>
          </span>

          <span style="color: #666666; margin-right: 10px" class="">{{
            formatTimeStamp(item.timeStamp)
          }}</span>
        </div>
        <div class="flex items-center justify-start">
          <span class="material-icons text-[13px] text-[#999]" style="font-size: 13px">
            play_arrow
          </span>
          <span class="text-[14px]">{{ item.data.rAddr }}</span>
        </div>
        <div v-if="showLAddrList.includes(item.id)" class="flex">
          <div>
            <span class="text-[12px] text-[#045c85]">FROM</span>
            <span>-></span>
            <span class="text-[12px] text-[#333]">{{ item.data.lAddr }}</span>
          </div>
          <div class="ml-[12px]">
            <span class="text-[12px] text-[#045c85]">RULE</span>
            <span>-></span>
            <span class="text-[12px] text-[#333]">{{ item.data.rule }}</span>
          </div>
          <div class="ml-[12px]">
            <span class="text-[12px] text-[#045c85]">PROXY</span>
            <span>-></span>
            <span class="text-[12px] text-[#333]">{{ item.data.proxy }}</span>
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

<style scoped>
input {
  padding-left: 12px;
  border-radius: 5px;
  flex: 1;
  margin-left: 16px;
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  border: 1px solid #dcdcdc;
}

input::placeholder {
  color: #a3a3a3;
  font-size: 16px;
}

.blue {
  background-color: #179bbb;
  flex: auto;
}

.infoLong {
  width: 65px;

  transition-timing-function: linear;
}

.debugLong {
  width: 67px;

  transition-timing-function: linear;
}

.button {
  margin-right: 20px;
  display: flex;
  align-items: center;

  .level-group {
    display: flex;
    flex-direction: column;
    margin: 0 16px;

    .level {
      display: flex;
      color: white;
      font-size: 14px;
      border-radius: 5px;
      height: 26px;
      width: 117px;
      line-height: 26px;
      box-sizing: border-box;
      background-color: #c7bfbf;
      margin: 2px 0;

      .simple,
      .info {
        text-align: center;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        width: 50px;
      }

      .detailed,
      .debug {
        text-align: center;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        width: 52px;
      }
    }
  }
}

.clear {
  background-color: #2ca51d;
  margin-right: 8px;
}

.stop {
  background-color: #f56363;
}

.start {
  background-color: #179bbb;
}

.clear,
.stop,
.start {
  user-select: none;
  cursor: pointer;
  height: 30px;
  width: 70px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  border-radius: 3px;
}
</style>
