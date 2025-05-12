<script setup>
import TopInfo from '@/components/TopInfo.vue'
import AppearanceItem from '@/components/settings/AppearanceItem.vue'
</script>

<template>
  <div class="flex h-full flex-col overflow-y-hidden">
    <TopInfo class="flex items-center justify-between px-[20px]">
      <div class="text-[20px]">Settings</div>
      <div>
        <button>Reset All Settings</button>
        <button>Force Quit</button>
        <button>Quit</button>
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
