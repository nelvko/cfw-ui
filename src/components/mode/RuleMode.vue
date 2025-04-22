<script setup>
import { getGroupList } from '@/api/group.js'
import { onMounted } from 'vue'
import { useProxiesStore } from '@/stores/proxies.js'
import { storeToRefs } from 'pinia'
import ProxyGroups from '@/components/mode/components/ProxyGroups.vue'

const { group } = storeToRefs(useProxiesStore())
onMounted(() => {
  getGroupList().then((res) => {
    group.value = res.proxies
  })
})
</script>

<template>
  <div class="rule-mode">
    <ProxyGroups group-name="default" />
    <ProxyGroups group-name="default" />
  </div>
</template>

<style scoped>
.rule-mode {
  height: 100%;
}
</style>
