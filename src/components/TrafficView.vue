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
  <div class="traffic-view">
    <div class="traffic">
      <span class="material-symbols-outlined up">straight</span>
      <span class="num">{{ upSpeed.num }}</span>
      <span class="unit">{{ upSpeed.unit }}/s</span>
    </div>

    <div class="traffic">
      <span class="material-symbols-outlined down">straight</span>
      <span class="num">{{ downSpeed.num }}</span>
      <span class="unit">{{ downSpeed.unit }}/s</span>
    </div>
  </div>
</template>

<style scoped>
.traffic-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100%;
}

.traffic {
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
  width: 100%;

  .up,
  .down {
    font-size: 12px;
  }

  .down {
    transform: rotate(180deg);
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
}
</style>
