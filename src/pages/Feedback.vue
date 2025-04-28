<script setup>
import Model from '@/components/Model.vue'
import { ref } from 'vue'

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
        <a @click="show = !show">Statement</a>
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
  <Model to="#app-view" v-if="show" @close="show = false">
    <div class="h-[80%] w-[50%] overflow-y-auto rounded-xl bg-white p-4">
      <p>
        1. This software is only intended for the purpose of learning and researching network
        technology. Users must comply with the laws and regulations in their respective regions and
        must not use it for illegal purposes. The software will not be held responsible for any
        actions of the user.
      </p>
      <br />
      <p>
        2. Users must strictly abide by the laws, regulations, and policies of their own
        countries/regions when using this software. Any consequences or liabilities resulting from
        violations of relevant laws, regulations, and policies shall be borne by the user.
      </p>
      <br />
      <p>
        3. The software is not responsible for the transmission of content. Therefore, if any
        problems or consequences arise from the use of this software, the user shall bear all
        responsibility.
      </p>
      <br />
      <p>
        4. If the software violates any laws and regulations of the user's country/region, the user
        must immediately stop using it and bear the corresponding legal responsibility.
      </p>
      <br />

      <p>
        5. While using this software, the user acknowledges and agrees that the software cannot
        guarantee network stability, accuracy, timeliness, and security. The software will not be
        held responsible for any connection problems or inability to connect caused by network
        congestion, firewall restrictions, DNS pollution, operator interference, and other reasons.

        <br />
      </p>

      <p>
        6. The software does not provide technical support and is not responsible for any direct or
        indirect losses caused by the user's use of this software, including but not limited to
        property damage, data loss, and other forms of loss.
      </p>
      <br />

      <p>
        7. The software has made every effort to ensure the stability and safety of the software,
        but will not be held responsible for any direct or indirect losses suffered by the user due
        to the use of this software.
      </p>
      <br />

      <p>
        8. The software reserves the right to change the terms and conditions at any time. Once the
        terms and conditions change, an announcement will be posted on the software page. Users need
        to pay attention and abide by the latest version of the terms and conditions.
      </p>
      <br />

      <p>
        9. The software may display advertisements from third-party entities. The software does not
        endorse, guarantee, or assume responsibility for the accuracy, relevancy, or quality of the
        information presented in these advertisements. Users acknowledge and agree that the software
        is not liable for any loss or damage arising from the display of advertisements or any
        transactions or interactions users may have with the advertisers. The user is solely
        responsible for any interactions with advertisers and is advised to exercise caution and
        conduct due diligence before engaging in any transactions or interactions with advertisers.
      </p>
      <br />
    </div>
  </Model>
</template>

<style scoped>
a {
  color: #019ff5;
  margin-right: 20px;
  cursor: pointer;
}
.title {
  font-size: 18px;
}
</style>
