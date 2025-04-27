<script setup>
import { ref } from 'vue'
import Model from '@/components/Model.vue'

const show = ref(false)
</script>

<template>
  <main class="relative flex h-full">
    <div class="mx-8 mt-3 flex-1 overflow-hidden">
      <div class="title">Developer</div>
      <a href="https://github.com/nelvko">nelvko</a>
      <div class="title">Relevance</div>
      <div>
        <a href="https://github.com/Fndroid/clash_for_windows_pkg">Github</a>
        <a href="https://docs.cfw.lbyczf.com/">Document</a>
        <a @click="show = !show">Disclaimer</a>
        <Model v-if="show" @click="show = !show" />
        <a>Statement</a>
      </div>
      <div class="title">Credits</div>
      <div class="flex flex-wrap">
        <a href="https://github.com/Dreamacro/clash">Clash</a>
        <a href="https://github.com/yichengchen/clashX">ClashX</a>
        <a href="https://apps.apple.com/us/app-bundle/quantumult-x-upgrade/id1482985563"
          >Quantumult(X)</a
        >
        <a href="https://dev.maxmind.com/geoip/geoip2/geolite2">GEOLite2</a>
        <a href="https://github.com/twitter/twemoji">twemoji</a>
        <a href="https://github.com/tiagonmas/Windows-Loopback-Exemption-Manager">EnableLoopback</a>
        <a href="https://github.com/Noisyfox/sysproxy">sysproxy</a>
        <a href="https://github.com/eycorsican/go-tun2socks">go-tun2socks</a>
        <a href="https://github.com/Jigsaw-Code/outline-apps">outline-client</a>
        <a href="https://github.com/microsoft/terminal/">terminal</a>
        <a href="https://www.wintun.net/">Wintun</a>
        <a href="https://github.com/winsw/winsw">winsw</a>
        <a href="https://github.com/Kr328/clash-premium-installer">clash-premium-installer</a>
        <a href="https://github.com/microsoft/monaco-editor">monaco-editor</a>
        <a href="https://fonts.google.com/icons">Material Icons</a>
      </div>
      <div class="title">Advertisement</div>
      <img
        class="my-[10px] h-[150px] w-[620px]"
        src="https://gh-card.dev/repos/nelvko/clash-for-linux-install.svg"
      />
      <img class="h-[150px] w-[620px]" src="https://gh-card.dev/repos/nelvko/cfw-ui.svg" />
    </div>
  </main>
</template>

<style scoped>
a {
  color: #019ff5;
  margin-right: 20px;
}
.title {
  font-size: 18px;
}
</style>
