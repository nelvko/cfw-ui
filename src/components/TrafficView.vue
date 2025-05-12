<script setup>
import { computed, onMounted, ref } from 'vue'
import { useFormatSpeed } from '@/hooks/formatSpeed.js'
import { traffic } from '@/api/ws.js'

const up = ref(null)
const down = ref(null)

onMounted(() => {
  traffic.onmessage = (event) => {
    // console.log('📩 收到消息：', event)
    const data = JSON.parse(event.data)
    up.value = data.up
    down.value = data.down
  }
})

const upSpeed = computed(() => {
  return useFormatSpeed(up.value)
})
const downSpeed = computed(() => {
  return useFormatSpeed(down.value)
})
</script>

<template>
  <div class="flex h-full flex-col items-center justify-around">
    <div class="traffic">
      <span class="material-icons up">straight</span>
      <span class="num">{{ upSpeed.num }}</span>
      <span class="unit">{{ upSpeed.unit }}/s</span>
    </div>

    <div class="traffic">
      <span class="material-icons rotate-180">straight</span>
      <span class="num">{{ downSpeed.num }}</span>
      <span class="unit">{{ downSpeed.unit }}/s</span>
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  font-size: 12px;
}

.num {
  font-size: 14px;
  margin: 0 -5px 0 -9px;
  /*margin-left: 7px;*/
}

.unit {
  font-size: 0.6rem;
  /*margin-right: 13px;*/
}

.traffic {
  @apply flex w-full items-baseline justify-evenly;
}
</style>
