<script setup>
import TopInfo from '@/components/TopInfo.vue'
import AppearanceItem from '@/components/settings/AppearanceItem.vue'
import { useSetupStore } from '@/stores/setup/index.js'
import { storeToRefs } from 'pinia'

const { setupInfo } = storeToRefs(useSetupStore())

function quit() {
  setupInfo.value.host = null
  setupInfo.value.port = null
  setupInfo.value.secret = null
  window.location.reload(true)
}
</script>

<template>
  <div class="flex h-full flex-col overflow-y-hidden">
    <TopInfo class="flex items-center justify-between px-[20px]">
      <div class="text-[20px]">{{ $t('Settings') }}</div>
      <div>
        <button>{{ $t('Reset All Settings') }}</button>
        <button @click="quit">{{ $t('Force Quit') }}</button>
        <button @click="quit">{{ $t('Quit') }}</button>
      </div>
    </TopInfo>
    <div class="flex-1 overflow-y-auto px-6">
      <!--      <SecurityItem />-->
      <!--      <GeneralItem />-->
      <AppearanceItem />
    </div>
  </div>
</template>

<style scoped>
:root {
  --spacing: 0.25rem;
}

button {
  color: #fa1313;
  background-color: #f1f1f1;
  height: 31px;
  box-sizing: border-box;
  border-radius: 3px;
  margin-left: 10px;
  padding: 4px 14px;
}
</style>
