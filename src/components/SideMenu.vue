<script setup>
import TrafficView from "@/components/TrafficView.vue";
import onlineIcon from "@/assets/static/imgs/tray-proxy-online.png"
import {ref} from "vue";
import DivLine from "@/components/DivLine.vue";
import {useRoute, useRouter} from 'vue-router'

const router = useRouter();
let time = ref(null)
let uploadSpeed = ref(null)
let downloadSpeed = ref(null)
let menuItem = ref([
  "General",
  "Proxies",
  "Profiles",
  "Logs",
  "Connections",
  "Settings",
  "Feedback"
])
let updateTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  time.value = `${hours} : ${minutes} : ${seconds}`;
  uploadSpeed.value = Math.round(Math.random() * 100);
  downloadSpeed.value = Math.round(Math.random() * 100);
}
setInterval(updateTime, 1000)


const activeIndex = ref(0)
const clickItem = (index, item) => {
  activeIndex.value = index
  router.push(`/${item}`)
}


</script>

<template>
  <div class="container grey-bg">
    <div class="traffic">
      <traffic-view type="arrow_upward"
                    :speed="uploadSpeed"
                    unit="B/s"
      />
      <traffic-view type="arrow_downward"
                    :speed="downloadSpeed"
                    unit="B/s"
      />
    </div>
    <DivLine/>
    <div class="menu">
      <div class="menu-item grey-bg"
           :class="[{active: activeIndex === index},{topRadius: activeIndex === index - 1},{bottomRadius: activeIndex === index + 1 }]"
           @click="clickItem(index,item)"
           v-for="(item, index) in menuItem"
           :key="index"
      >{{ item }}
      </div>
      <div-line/>
      <div style="flex-grow: 1"
           class="grey-bg"></div>
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

.material-symbols-outlined {
    font-variation-settings: 'FILL' 1;
    color: #41b883;
    font-size: 16px;
}

.container {
    display: flex;
    flex-direction: column;
    /*width: 100%;*/
}

.traffic {
    height: 79px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.menu {
    height: 69%;
    display: flex;
    flex-direction: column;
    background-color: white;

    .menu-item {
        cursor: pointer;
        height: 11%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #747D88;
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
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.time {
    font-size: 1em;
    position: absolute;
    bottom: 40px;

}

.status {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 10px;

}
</style>