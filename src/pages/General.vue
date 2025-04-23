<script setup>
//Loading...
// 00:00:00
// Disconnected
import { computed, ref, onMounted } from 'vue'
import OptionItem from '@/components/OptionItem.vue'
import { getTraffic, getVersion } from '@/api/common.js'
import ToolTip from '@/components/ToolTip.vue'

onMounted(() => {
  getTraffic().then((res) => {
    console.log(res)
  })
  getVersion().then((res) => {
    version.value = res.version
  })
})

const version = ref('')
version.value = 'v0.20.39'

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
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex items-center justify-center">
      <img alt="logo" class="h-24" src="@/assets/Clash_Logo.png" />
      <div style="display: flex; align-items: baseline">
        <!--        快速重启软件-->
        <div class="cfw" @dblclick="reloadPage">Clash for Windows</div>
        <div class="version" @click="checkUpdate">{{ version }}</div>
      </div>
    </div>
    <div class="options">
      <OptionItem label="Port" string-value="7890">
        <template #right-icon>
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

      <OptionItem :is-switch="true" :switch-value="true" label="Allow LAN" string-value="Bind: *">
        <template #left-icon>
          <ToolTip :tip="allowLanInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>
          <ToolTip tip="network interfaces" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">device_hub</span>
          </ToolTip>
        </template>
      </OptionItem>
      <OptionItem label="Log Level" string-value="Info" />

      <OptionItem :is-switch="true" :switch-value="false" label="IPv6" />

      <OptionItem label="Clash Core" string-value="2023.08.17-13-gdcc8d87 Premium(49776)">
        <template #left-icon>
          <ToolTip tip="add firewall rules(for Allow LAN and system stack)" right dark>
            <span class="material-icons grey icon-grey-bg">gpp_maybe</span>
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

      <OptionItem label="Home Directory" string-value="Open Folder" />

      <OptionItem label="UWP Loopback" string-value="Launch Helper" />

      <OptionItem label="TAP Device" string-value="Manage" />

      <OptionItem label="Service Mode" string-value="Manage">
        <template #left-icon>
          <span class="material-icons grey near">public</span>
        </template>
      </OptionItem>

      <OptionItem :is-switch="true" :switch-value="true" label="Tun Mode">
        <template #left-icon>
          <ToolTip :tip="tunInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>
          <ToolTip tip="Settings" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">settings</span>
          </ToolTip>
        </template>
      </OptionItem>

      <OptionItem :is-switch="true" :switch-value="true" label="Mixin">
        <template #left-icon>
          <ToolTip :tip="mixinInfo" light right>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>

          <ToolTip tip="Edit Mixin content" right dark>
            <span class="material-icons dark-blue-grey icon-grey-bg">settings</span>
          </ToolTip>
        </template>
      </OptionItem>

      <OptionItem :is-switch="true" :switch-value="true" label="System Proxy" />
      <OptionItem :is-switch="true" label="Start with Windows" :switch-value="true" />
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
