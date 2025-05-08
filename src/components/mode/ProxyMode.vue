<script setup>
import ProxyGroups from '@/components/mode/ProxyGroups.vue'
import { getProviders, getProxies } from '@/api/proxies.js'
import { ref } from 'vue'

defineProps({
  mode: String,
})
const providers = ref([])
getProxies()
getProviders().then((data) => {
  // providers.value = Object.entries(res.data.providers).reverse()
  providers.value = Object.entries(data.providers).reverse()
})
</script>

<template>
  <ProxyGroups
    v-if="mode === 'global'"
    :group-name="mode.toUpperCase()"
    :providers="providers.at(-1)[1]"
  />
  <ProxyGroups
    v-else
    v-for="(item, index) in providers.slice(0, -1)"
    :key="index"
    :group-name="item[0]"
    :providers="item[1]"
  />
</template>

<style scoped></style>
