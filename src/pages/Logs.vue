<script setup>
import { onMounted, ref } from 'vue'
import TopInfo from '@/components/TopInfo.vue'
import { logs } from '@/api/ws.js'

const isSimple = ref(true)
const isInfo = ref(true)

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

onMounted(() => {
  logs.onopen = () => {
    console.log('logs WebSocket 连接成功')
  }
  logs.onmessage = (event) => {
    const data = JSON.parse(event.data)
    // console.log('📩 收到消息：', data)
    logList.value.push(parseLogLine(data.payload))
  }
})
logList.value.push(
  parseLogLine(
    '[TCP] connected lAddr=127.0.0.1:57656 rAddr=geo.cookie-script.com:443 mode=rule rule=Match() proxy=☁️ Others[香港 01]'
  )
)

function switchLogLevel() {
  isSimple.value = !isSimple.value
}

function switchLogType() {
  isInfo.value = !isInfo.value
}

switchLogType
</script>

<template>
  <div class="logs">
    <TopInfo style="display: flex; align-items: center">
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
        <div class="clear">Clear</div>
        <div class="stop">Stop</div>
      </div>
    </TopInfo>
    <div class="view">
      <div
        v-for="(item, index) in logList"
        :key="index"
        style="
          border-bottom: 1px solid #eaeaea;
          padding-left: 20px;
          margin-top: 2px;
          height: 47px;
          box-sizing: border-box;
        "
        @click="show = !show"
      >
        <div style="color: #13af42; font-size: 13px; display: flex; justify-content: space-between">
          <span>{{ true ? '✅ [TCP] connected' : '❌' }}</span>
          <span style="color: #666666">18:57:57</span>
        </div>
        <div>
          <span class="material-symbols-outlined"> arrow_right </span>
          <span>{{ item.rAddr }}</span>
          <div>FROM</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

.logs {
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

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
  height: 30px;
  width: 70px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  border-radius: 3px;
}
</style>
