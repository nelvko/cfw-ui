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
    <div class="flex flex-1 overflow-y-hidden">
      <SideMenu />
      <div class="relative flex-1" id="app-view">
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
