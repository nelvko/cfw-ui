<script setup>
import TrafficView from '@/components/TrafficView.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopInfo from '@/components/TopInfo.vue'

const router = useRouter()

let time = ref(null)

let menuItem = ref([
  'general',
  'proxies',
  'profiles',
  'logs',
  'connections',
  'settings',
  'feedback',
])
let updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  time.value = `${hours} : ${minutes} : ${seconds}`
}
setInterval(updateTime, 1000)

const activeIndex = ref(0)
const clickItem = (index, item) => {
  activeIndex.value = index
  router.push(`/${item}`)
}
</script>

<template>
  <div class="side-menu grey-bg">
    <TopInfo>
      <traffic-view :up :down />
    </TopInfo>

    <div class="menu">
      <div
        class="menu-item grey-bg"
        :class="[
          { active: activeIndex === index },
          { topRadius: activeIndex === index - 1 },
          { bottomRadius: activeIndex === index + 1 },
        ]"
        @click="clickItem(index, item)"
        v-for="(item, index) in menuItem"
        :key="index"
      >
        {{ item }}
      </div>
      <div-line />
    </div>
    <div class="connected-time">
      <div class="time">{{ time }}</div>
      <div class="status">
        <span class="material-symbols-outlined">circle</span>
        <span style="font-size: 0.7em">Connected</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-menu {
  display: flex;
  flex-direction: column;
  width: 170px;
  height: 100%;
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
  color: #41b883;
  font-size: 16px;
}

.menu {
  display: flex;
  flex-direction: column;
  background-color: white;

  .menu-item {
    cursor: pointer;
    height: 57px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #747d88;
  }
}

.active {
  background-color: #fff;
  color: #000;
}

.topRadius {
  border-radius: 0 10px 0 0;
}

.bottomRadius {
  border-radius: 0 0 10px 0;
}

.connected-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
  justify-content: flex-end;
  flex: 1;
}

.time {
  font-size: 1em;
  bottom: 40px;
}
.status {
  display: flex;
  align-items: center;
}
</style>
