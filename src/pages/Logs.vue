<script setup>
import { onActivated, ref, useTemplateRef } from 'vue'
import TopInfo from '@/components/TopInfo.vue'
import { logs } from '@/api/ws.js'

const isSimple = ref(true)
const isInfo = ref(true)
// import log from '@/mock/logs.js'

const logList = ref([])

function parseLogLine(log) {
  const result = {}
  // 匹配基本字段
  const patterns = {
    type: /\[(.*?)\]/,
    status: /connected/,
    lAddr: /lAddr=([\d.]+:\d+)/,
    rAddr: /rAddr=([\w.-]+:\d+)/,
    mode: /mode=(\w+)/,
    rule: /rule=(\w+)\(([^)]+)\)/,
    proxy: /proxy=(.+)$/,
  }

  for (const key in patterns) {
    const match = log.match(patterns[key])
    if (match) {
      if (key === 'rule') {
        result.ruleType = match[1]
        result.ruleValue = match[2]
      } else {
        result[key] = match[1]
      }
    }
  }

  return result
}

onActivated(() => {
  console.log('onActivated')

  logs.onmessage = ({ data, timeStamp }) => {
    logList.value.push({
      ...parseLogLine(JSON.parse(data).payload),
      timeStamp,
    })
  }
  if (logList.value.length > 0) {
    logsBox.value.scrollTop = logsBox.value.scrollHeight
  }
})
function switchLogLevel() {
  isSimple.value = !isSimple.value
}

function switchLogType() {
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

function changeShowLAddrList(index) {
  const number = showLAddrList.value.indexOf(index)
  console.log('click index', index)
  console.log('indexof', number)

  if (number === -1) {
    showLAddrList.value.push(index)
  } else {
    showLAddrList.value.splice(number, 1)
  }
}
switchLogType
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <TopInfo class="flex items-center">
      <div style="margin-left: 21px">
        <div style="font-size: 20px">Request Logs</div>
        <div>mode: rule</div>
      </div>
      <input type="text" placeholder="Search" />
      <div class="button">
        <div class="level-group">
          <div class="level" @click="switchLogLevel">
            <div class="simple" :class="{ blue: isSimple }" style="width: 46%">Simple</div>
            <div class="detailed" :class="{ blue: isSimple === false }" style="width: 54%">
              Detailed
            </div>
          </div>
          <div class="level" @click="switchLogType">
            <div class="info" :class="{ blue: isInfo, long: isInfo }">info</div>
            <div class="debug" :class="{ blue: isInfo === false, long: isInfo === false }">
              debug
            </div>
          </div>
        </div>
        <div class="clear" @click="logList.length = 0">Clear</div>
        <div class="stop">Stop</div>
      </div>
    </TopInfo>
    <div
      v-if="logList.length !== 0"
      ref="logsBox"
      class="flex flex-1 flex-col overflow-y-auto"
      id="logs"
    >
      <div
        v-for="(item, index) in logList"
        :key="index"
        class="height-[47px] mt-[2px] border-b-[1px] border-b-[#eaeaea] pl-[20px]"
        @click="changeShowLAddrList(item.timeStamp)"
      >
        <div class="flex justify-between" style="font-size: 12px">
          <span class="flex items-center justify-center">
            <span class="material-icons text-[#77b255]"> check_box </span>
            <span class="text-[#13af42]">[TCP] connected</span>
          </span>

          <span style="color: #666666">{{ formatTimeStamp(item.timeStamp) }}</span>
        </div>
        <div class="flex items-center justify-start">
          <span class="material-icons text-[13px] text-[#999]" style="font-size: 13px">
            play_arrow
          </span>
          <span>{{ item.rAddr }}</span>
        </div>
        <div v-if="showLAddrList.includes(item.timeStamp)">
          <span class="text-[#045c85]">FROM</span>
          <span>--></span>
          <span class="text-[#333]">{{ item.lAddr }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="logList.length === 0"
      class="flex flex-1 flex-col items-center justify-center text-[#808080]"
    >
      <span>Empty log list</span>
      <span>Refresh your browser to make requests.</span>
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
}

.long {
  width: 60%;
  flex: 1;
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
        /*width: 46%;*/
      }

      .detailed,
      .debug {
        text-align: center;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;

        /*width: 54%;*/
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

.clear,
.stop {
  cursor: pointer;
  height: 30px;
  width: 70px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  border-radius: 3px;
}
</style>
