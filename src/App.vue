<script setup>
import SideMenu from "/src/components/SideMenu.vue";
import WindowBar from "@/components/WindowBar.vue";
import {onMounted} from "vue";
import {getProviders, getProxies} from "@/api/proxies.js";
import {useProxiesStore} from "@/stores/proxies.js";
import {storeToRefs} from "pinia";

const {proxies, providers} = storeToRefs(useProxiesStore());
onMounted(() => {
  getProxies().then(res => {
    proxies.value = res.data.proxies;
  })
  getProviders().then(res => {
    providers.value = res.data.providers;
  })
})
</script>

<template>
  <div class="container">
    <WindowBar class="window-bar"/>
    <div class="content">
      <SideMenu class="side-menu"/>
      <div class="router-view">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .window-bar {
        height: 24px;
    }

    .content {
        display: flex;
        height: 100%;

        .side-menu {
            width: 11.8%;
        }

        .router-view {
            flex: 1;
        }
    }
}
</style>
