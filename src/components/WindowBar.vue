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
  <div class="relative flex h-6 flex-none items-center justify-center bg-[#ebebeb]">
    <div class="text-[12px]">{{ titleBarText }}</div>
    <div class="absolute right-0 flex h-full items-center justify-center">
      <span
        class="material-icons light-blue-grey"
        @click="isKeep = !isKeep"
        :class="{ keepActive: isKeep }"
        >push_pin</span
      >
      <span class="material-icons light-blue-grey">remove</span>
      <span class="material-icons light-blue-grey" @click="isFull = !isFull">{{ fullState }} </span>
      <span class="material-icons light-blue-grey close">close</span>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 20;
}

.light-blue-grey {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  cursor: pointer;

  font-size: 0.9em;
  line-height: 100%;
  height: 100%;
}
.light-blue-grey:hover {
  background-color: #c6c6c6;
}

.close:hover {
  background-color: #fc6868;
}

.keepActive {
  color: #0c7d9d;
}
</style>
