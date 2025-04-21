<script setup>
import SideMenu from '/src/components/SideMenu.vue'
import WindowBar from '@/components/WindowBar.vue'
import { onMounted } from 'vue'
import { getProviders, getProxies } from '@/api/proxies.js'
import { useProxiesStore } from '@/stores/proxies.js'
import { storeToRefs } from 'pinia'

const { proxies, providers } = storeToRefs(useProxiesStore())
onMounted(() => {
  getProxies().then((res) => {
    proxies.value = res.data.proxies
  })
  getProviders().then((res) => {
    providers.value = res.data.providers
  })
})
</script>

<template>
  <div class="container1">
    <WindowBar />
    <div class="content">
      <SideMenu />
      <div class="router-view">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container1 {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  .content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .router-view {
      flex: 1;
      /*height: 100%;*/
      /*width: 100%;*/
    }
  }
}
</style>
