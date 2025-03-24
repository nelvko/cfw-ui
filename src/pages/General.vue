<script setup>

//Loading...
// 00:00:00
// Disconnected
import {ref} from "vue";
import OptionItem from "@/components/OptionItem.vue";

const version = ref("")
version.value = 'v0.20.39'

const allowLanInfo = ref(
    `Turn on to listen on all interfaces by\n
    default,or else only listen on 127.0.0.1.\n
    You can change the Bind Address on the\n
    right side to specify a particular interface.\n
    Inbounds`)
const tunInfo = ref(
    `To enable this mode, please install\n
    Service Mode first!`)
const mixinInfo = ref(`Mixin allows you to overwrite the original\n
    configuration file. Docs`)

</script>

<template>
  <div class="general">
    <div class="title">
      <img src="@/assets/Clash_Logo.png"
           class="logo"
           alt="logo">
      <div style="display: flex;align-items: baseline">
        <div class="cfw">Clash for Windows</div>
        <div class="version">{{ version }}</div>
      </div>
    </div>
    <div class="options">
      <option-item label="Port"
                   string-value="7890"/>

      <option-item label="Allow LAN"
                   string-value="Bind: *"
                   :is-switch="true"
                   :switch-value="true"
                   :icon-info-tip="allowLanInfo"/>

      <option-item label="Log Level"
                   string-value="Info"
      />

      <option-item label="IPv6"
                   :is-switch="true"
                   :switch-value="false"
      />

      <option-item label="Clash Core"
                   string-value="2023.08.17-13-gdcc8d87 Premium(49776)"
      />

      <option-item label="Home Directory"
                   string-value="Open Folder"/>

      <option-item label="UWP Loopback"
                   string-value="Launch Helper"/>

      <option-item label="TAP Device"
                   string-value="Manage"/>

      <option-item label="Service Mode"
                   string-value="Manage"/>

      <option-item label="Tun Mode"
                   :icon-info-tip="tunInfo"
                   :is-switch="true"
                   :switch-value="true"/>


      <option-item label="Mixin"
                   :info="mixinInfo"
                   :is-switch="true"
                   :switch-value="true"/>

      <option-item label="System Proxy"
                   :is-switch="true"
                   :switch-value="true"/>
      <option-item label="Start with Windows"
                   :is-switch="true"
                   switch-value="true"/>
    </div>
  </div>
</template>

<style scoped>
.general {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 45px;

    .cfw {
        color: #2C3E50;
        margin: 19px;
        font-size: 30px;
    }

    .logo {
        height: 6em;
    }
}

.options {
    display: flex;
    flex-direction: column;
    width: 50%;
}

</style>