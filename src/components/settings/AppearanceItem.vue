<script setup>
import OptionItem from '@/components/OptionItem.vue'
import SettingItem from '@/components/SettingItem.vue'
import SwitchOption from '@/components/SwitchOption.vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings/settings.js'

const { titleBarText } = storeToRefs(useSettingsStore())
</script>

<template>
  <SettingItem title="Appearance">
    <OptionItem label="Theme">
      <template #right>
        <div class="flex h-[26px] w-[234.5px] bg-transparent text-[12px] text-white">
          <div class="flex flex-[50] items-center justify-center rounded-l-[6px] bg-[#179bbb]">
            Light
          </div>
          <div class="flex flex-[50] items-center justify-center bg-[#c7bfbf]">Dark</div>
          <div class="flex flex-[60] items-center justify-center bg-[#bdb3b3]">国庆中秋</div>
          <div class="flex flex-[74.5] items-center justify-center rounded-r-[6px] bg-[#c7bfbf]">
            Cyberpunk
          </div>
        </div>
      </template>
    </OptionItem>
    <OptionItem label="Follow System Theme">
      <template #right>
        <SwitchOption :value="false" />
      </template>
    </OptionItem>
    <OptionItem label="Font Family">
      <template #right> </template>
    </OptionItem>
    <OptionItem label="Title Bar Text">
      <template #left> </template>
      <template #right>
        <input type="text" v-model="titleBarText" />
      </template>
    </OptionItem>
  </SettingItem>
</template>

<style scoped></style>
