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
      <template #right> Light</template>
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
