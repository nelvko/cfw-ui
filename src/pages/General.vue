<script setup>
//Loading...
// 00:00:00
// Disconnected
import { computed, onMounted, ref } from 'vue'
import OptionItem from '@/components/OptionItem.vue'
import { getConfig, getTraffic, getVersion } from '@/api/common.js'
import ToolTip from '@/components/ToolTip.vue'

onMounted(() => {
  getTraffic().then((res) => {
    console.log(res)
  })
  getVersion().then((res) => {
    version.value = res
  })
  getConfig().then((res) => {
    config.value = res
  })
})

const version = ref({})
const config = ref({})
const allowLanInfo = ref(
  `Turn on to listen on all interfaces by\n
    default,or else only listen on 127.0.0.1.\n
    You can change the Bind Address on the\n
    right side to specify a particular interface.\n
    Inbounds`
)
const tunInfo = ref(
  `To enable this mode, please install\n
    Service Mode first!`
)
const mixinInfo = ref(`Mixin allows you to overwrite the original\n
    configuration file. Docs`)

function reloadPage() {
  window.location.reload(true)
}

function checkUpdate() {}

const isRandomPort = ref(false)

function switchRandomPort() {
  isRandomPort.value = !isRandomPort.value
}

const name = computed(() => {
  return isRandomPort.value ? 'sync' : 'sync_disabled'
})
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
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-center justify-center">
      <img alt="logo" class="h-24" src="@/assets/Clash_Logo.png" />
      <div style="display: flex; align-items: baseline">
        <!--        快速重启软件-->
        <div class="cfw" @dblclick="reloadPage">Clash for Windows</div>
        <div class="version" @click="checkUpdate">{{ version.version }}</div>
      </div>
    </div>
    <div class="options">
      <OptionItem :label="$t('Port')" :value="config['mixed-port']">
        <template #right>
          <ToolTip :top="true" :dark="true" tip="terminal">
            <span class="material-icons">terminal</span>
          </ToolTip>
          <ToolTip top dark tip="random mixed port">
            <span
              :class="[{ lightBlueGrey: !isRandomPort }, { sync: isRandomPort }]"
              class="material-icons grey"
              @click="switchRandomPort"
              >{{ name }}</span
            >
          </ToolTip>
        </template>
      </OptionItem>
      <OptionItem :label="$t('Allow LAN')" :value="config['allow-lan']">
        <template #left>
          <ToolTip :tip="allowLanInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>
          <ToolTip tip="network interfaces" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">device_hub</span>
          </ToolTip>
        </template>
        <template #right>
          <div class="border-b border-dashed border-[#cbcbcb]">
            Bind {{ config['bind-address'] }}
          </div>
        </template>
      </OptionItem>
      <OptionItem label="Log Level" :value="config['allow-lan']" />
      <OptionItem label="IPv6" :value="config.ipv6" />
      <OptionItem :label="$t('Clash Core')" :value="clashCore">
        <template #left>
          <ToolTip tip="add firewall rules(for Allow LAN and system stack)" right dark>
            <span v-if="addRule === 0" class="material-icons grey icon-grey-bg" @click="addRules"
              >gpp_maybe</span
            >
            <span
              v-if="addRule === 1"
              class="material-icons icon-grey-bg animate-bounce text-[#2c3e50]"
            >
              edit
            </span>
            <span
              @click="addRules"
              v-if="addRule === 2"
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
.cfw {
  color: #2c3e50;
  margin: 19px;
  font-size: 30px;
  cursor: pointer;
}

.version {
  cursor: pointer;
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

.options {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.icon-grey-bg:hover {
  background-color: #c1c1c1;
}

.sync {
  color: #41b883;
}
</style>
