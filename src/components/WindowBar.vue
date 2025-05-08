<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings/settings.js'

const isFull = ref(true)
const isKeep = ref(false)
const fullState = computed(() => {
  return isFull.value ? 'close_fullscreen' : 'check_box_outline_blank'
})

const { titleBarText } = storeToRefs(useSettingsStore())
</script>

<template>
  <div class="relative flex h-[25px] flex-none items-center justify-center bg-[#ebebeb]">
    <div class="text-[12px]">{{ titleBarText }}</div>
    <div class="absolute right-0 flex h-full items-center justify-center">
      <span class="material-icons" @click="isKeep = !isKeep" :class="{ keepActive: isKeep }"
        >push_pin</span
      >
      <span class="material-icons">remove</span>
      <span class="material-icons" @click="isFull = !isFull">{{ fullState }} </span>
      <span class="material-icons hover:!bg-[#fc6868]">close</span>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  cursor: pointer;

  font-size: 0.9em;
  line-height: 100%;
  height: 100%;
}

.material-icons:hover {
  background-color: #c6c6c6;
}

.keepActive {
  color: #0c7d9d;
  gap: 1px;
}
</style>
