<script setup>
//Loading...
// 00:00:00
// Disconnected
import { computed, onMounted, ref } from 'vue'
import OptionItem from '@/components/OptionItem.vue'
import { getTraffic, getVersion } from '@/api/common.js'
import ToolTip from '@/components/ToolTip.vue'
import { getConfig, updateAllowLan, updateConfig, updateLogLevel } from '@/api/configs.js'
import Modal from '@/components/Model.vue'
import { useSetupStore } from '@/stores/setup/index.js'

const version = ref({})

onMounted(() => {
  getTraffic().then((res) => {
    console.log(res)
  })
  getVersion().then((res) => {
    version.value = res.data
  })
  getConfig().then((res) => {
    config.value = res.data
  })
})

const config = ref({})
const allowLanInfo = ref(
  `Turn on to listen on all interfaces by\n
    default,or else only listen on 127.0.0.1.\n
    You can change the Bind Address on the\n
    right side to specify a particular interface.\n
    Inbounds`,
)
const tunInfo = ref(
  `To enable this mode, please install\n
    Service Mode first!`,
)
const mixinInfo = ref(`Mixin allows you to overwrite the original\n
    configuration file. Docs`)

function reloadPage() {
  window.location.reload(true)
}

function checkUpdate() {}
const isChangeMixedPort = ref(false)
const mixedPort = ref(null)
const isMixedPortError = ref(false)

async function changeMixedPort() {
  if (!mixedPort.value || mixedPort.value < 0 || mixedPort.value >= 65353) {
    return (isMixedPortError.value = true)
  }
  await updateConfig({ 'mixed-port': mixedPort.value })
  refreshConfig()
  isChangeMixedPort.value = false
}
const isRandomPort = ref(false)

async function switchRandomPort() {
  mixedPort.value = Math.floor(Math.random() * (65353 + 1))
  await updateConfig({ 'mixed-port': mixedPort.value })
  refreshConfig()
  isRandomPort.value = !isRandomPort.value
}

const isTerminal = ref(false)
const isChangeBindAddress = ref(false)

const clashCore = computed(() => {
  let clash = 'clash'
  const versionNo = version.value.version
  if (version.value.premium) {
    clash = 'Premium'
  }
  if (version.value.meta) {
    clash = 'mihomo'
  }
  return `${versionNo} ${clash} (9090)`
})
// 0关闭 1开启中 2 开启
const addRule = ref(0)

function addRules() {
  switch (addRule.value) {
    case 0:
      addRule.value = 1
      setTimeout(() => {
        addRule.value = 2
      }, 5000)

      break
    case 2:
      addRule.value = 1
      setTimeout(() => {
        addRule.value = 0
      }, 5000)
      break
  }
}

async function refreshConfig() {
  const res = await getConfig()
  Object.assign(config.value, res.data)
}

// // function withRefresh(fn: Function) {
// return async (...args: any[]) => {
//   await fn(...args)
//   await refreshConfig()
// }
// }

const isShowSwitchLogLevel = ref(false)
const logLevelList = ['silent', 'error', 'warning', 'info', 'debug']

async function changeLogLevel(level) {
  await updateConfig({ 'log-level': level })
  refreshConfig()
  isShowSwitchLogLevel.value = false
}

async function changeAllowLan() {
  await updateAllowLan(!config.value['allow-lan'])
  refreshConfig()
}

function openWebUI() {
  const { setupInfo } = useSetupStore()
  let { host: hostInfo = '127.0.0.1', secret = null } = setupInfo
  // if (host.indexOf(':') !== -1) {
  const [host, port] = hostInfo.split(':')
  // }
  window.open(
    `https://clash.razord.top/#/proxies?host=${host}&port=${port}&secret=${secret}`,
    '_target',
  )
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex items-center justify-center">
      <img alt="logo" class="h-[60px] w-[60px]" src="@/assets/clash-1.svg" />
      <div style="display: flex; align-items: baseline">
        <!--        快速重启软件-->
        <div class="m-[19px] cursor-pointer text-[30px] text-[#2c3e50]" @dblclick="reloadPage">
          Clash for Windows
        </div>
        <div class="cursor-pointer" @click="checkUpdate">{{ version.version }}</div>
      </div>
    </div>
    <div class="flex w-1/2 flex-col">
      <OptionItem
        :label="$t('Port')"
        :value="config['mixed-port']"
        @click-value="isChangeMixedPort = true"
      >
        <template #right>
          <ToolTip :top="true" :dark="true" tip="terminal">
            <span @click="isTerminal = true" class="material-icons">terminal</span>
          </ToolTip>
          <ToolTip top dark tip="random mixed port">
            <span
              :class="[{ lightBlueGrey: !isRandomPort }, { sync: isRandomPort }]"
              class="material-icons grey"
              @click="switchRandomPort"
              >{{ isRandomPort ? 'sync' : 'sync_disabled' }}</span
            >
          </ToolTip>
        </template>
      </OptionItem>
      <Modal to="#layout" v-if="isChangeMixedPort" @close="isChangeMixedPort = false">
        <div class="min-h-[239px] w-[390px] bg-white *:px-[20px]">
          <div class="flex h-[80px] flex-col justify-evenly">
            <div class="text-xl">Change Mixed Port</div>
            <div class="text-[#179bbb]">mixed = http + socks</div>
          </div>
          <div class="flex h-[88px] flex-col justify-between border-t border-t-[#e9e9e9] py-[10px]">
            <div>New Port</div>
            <input
              type="text"
              class="h-[43px]"
              v-model.number="mixedPort"
              :placeholder="config['mixed-port']"
            />
          </div>
          <div class="border-t border-t-[#e9e9e9] pt-[10px] pb-[20px]">
            <div class="text-[#ff0000]" v-show="isMixedPortError">
              Port must be an integer between 0 to 65353
            </div>
            <div class="flex justify-evenly text-white *:h-[40px] *:w-[100px]">
              <button class="bg-[#676475]" @click="isChangeMixedPort = false">Cancel</button>
              <button class="bg-[#3e3c4d]" @click="changeMixedPort">OK</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal to="#layout" v-if="isTerminal" @close="isTerminal = false">
        <div class="bg-white *:px-[20px]">
          <div>Open terminal with proxy set up</div>
          <div>Select a terminal</div>
          <div>
            <input type="checkbox" />
            run as admin
          </div>
          <div class="flex flex-wrap text-white *:h-[40px] *:w-[100px] *:bg-[#3e3c4d]">
            <button>CMD</button>
            <button>Powershell</button>
            <button>Windows Terminal</button>
            <button>Copy Commands Only</button>
          </div>
        </div>
      </Modal>

      <OptionItem
        :label="$t('Allow LAN')"
        :value="config['allow-lan']"
        @click-value="changeAllowLan"
      >
        <template #left>
          <ToolTip :tip="allowLanInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>
          <ToolTip tip="network interfaces" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">device_hub</span>
          </ToolTip>
        </template>
        <template #right>
          <div class="border-b border-dashed border-[#cbcbcb]" @click="isChangeBindAddress = true">
            Bind {{ config['bind-address'] }}
          </div>
        </template>
      </OptionItem>
      <Modal to="#layout" v-if="isChangeBindAddress" @close="isChangeBindAddress = false">
        <div class="bg-white *:px-[20px]">
          <div>Change Bind Address</div>
          <div class="text-[#179bbb]">
            Allow LAN will only bind to address you set,* means all interfaces
          </div>
          <div>New Bind Address</div>
          <input />
          <div class="flex justify-evenly text-white *:h-[40px] *:w-[100px]">
            <button class="bg-[#676475]" @click="isChangeMixedPort = false">Cancel</button>
            <button class="bg-[#3e3c4d]" @click="changeMixedPort">OK</button>
          </div>
        </div>
      </Modal>
      <OptionItem
        label="Log Level"
        :value="config['log-level']"
        @click-value="isShowSwitchLogLevel = true"
      />
      <Modal v-if="isShowSwitchLogLevel" to="#layout" @close="isShowSwitchLogLevel = false">
        <div class="bg-white p-[20px]">
          <div class="text-xl">Change Log Level</div>
          <div>silent will prevent .log file to generate on next startup</div>
          <div class="mt-4">
            <button
              class="mr-[10px] h-[35px] rounded-md bg-[#3e3c4d] px-[9px] text-white"
              v-for="item in logLevelList"
              :key="item"
              @click="changeLogLevel(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>
      </Modal>
      <OptionItem label="IPv6" :value="config.ipv6" />
      <OptionItem :label="$t('Clash Core')" :value="clashCore" @click-value="openWebUI">
        <template #left>
          <ToolTip tip="add firewall rules(for Allow LAN and system stack)" right dark>
            <span v-if="addRule === 0" class="material-icons grey icon-grey-bg" @click="addRules"
              >gpp_maybe</span
            >
            <span
              v-else-if="addRule === 1"
              class="material-icons icon-grey-bg animate-bounce text-[#2c3e50]"
            >
              edit
            </span>
            <span
              @click="addRules"
              v-else-if="addRule === 2"
              class="material-icons icon-grey-bg text-[#41b883]"
            >
              gpp_good
            </span>
          </ToolTip>
          <ToolTip
            tip="Preview the final configuration file that was submitted to Clash Core"
            right
            dark
          >
            <span class="material-icons dark-blue-grey icon-grey-bg">memory</span>
          </ToolTip>
          <ToolTip tip="Resolve a host using Clash core" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg"> dns </span>
          </ToolTip>
          <ToolTip tip="Test script using by Script mode" dark right>
            <span class="material-icons dark-blue-grey icon-grey-bg">play_arrow</span>
          </ToolTip>
        </template>
      </OptionItem>

      <OptionItem :label="$t('Home Directory')" :value="$t('Open Folder')" />

      <OptionItem :label="$t('UWP Loopback')" :value="$t('Launch Helper')" />

      <OptionItem :label="$t('TAP Device')" :value="$t('Manage')" />

      <OptionItem :label="$t('Service Mode')" :value="$t('Manage')">
        <template #left>
          <span class="material-icons grey near">public</span>
        </template>
      </OptionItem>

      <OptionItem :label="$t('Tun Mode')" :value="config?.tun?.enable ?? false">
        <template #left>
          <ToolTip :tip="tunInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>
          <ToolTip tip="Settings" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">settings</span>
          </ToolTip>
        </template>
      </OptionItem>

      <OptionItem :label="$t('Mixin')" :value="true">
        <template #left>
          <ToolTip :tip="mixinInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>

          <ToolTip tip="Edit Mixin content" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">settings</span>
          </ToolTip>
        </template>
      </OptionItem>

      <OptionItem :label="$t('System Proxy')" :value="true" />
      <OptionItem :label="$t('Start with Windows')" :value="true" />
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  box-sizing: border-box;
  border-radius: 6px;
  padding: 3px;
  margin: 0 5px;
  font-variation-settings: 'FILL' 1;
  font-size: 16px;
}

.near {
  margin-left: 5px;
}

.light-blue-grey {
  color: #6b7884;
}

.dark-blue-grey {
  color: #2c3e50;
}

.grey {
  color: #b3b3b3;
}

.icon-grey-bg:hover {
  background-color: #c1c1c1;
}

.sync {
  color: #41b883;
}
</style>
