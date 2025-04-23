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
    proxies.value = res.proxies
  })
  getProviders().then((res) => {
    providers.value = res.providers
  })
})
</script>

<template>
  <div class="flex h-screen w-screen flex-col">
    <WindowBar />
    <div class="flex flex-1">
      <SideMenu />
      <div class="h-full w-full">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
