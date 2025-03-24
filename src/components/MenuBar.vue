<script setup>
import TrafficView from "@/components/TrafficView.vue";
import statusOk from "@/assets/status-ok.svg"
import statusFail from "@/assets/status-fail.svg"
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

const statusSrc = ref(statusOk)

</script>

<template>
  <div class="menu-bar grey-bg">
    <div class="traffic">
      <traffic-view type="⬆"
                    :speed="uploadSpeed"
                    unit="B/s"
      />
      <traffic-view type="⬇"
                    :speed="downloadSpeed"
                    unit="B/s"
      />
    </div>
    <div class="menu">
      <div-line/>
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
        <img :src="statusSrc"
             style="height: 1.2em"
             alt="status">
        <span style="font-size: 0.7em">Connected</span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.menu-bar {
    display: flex;
    flex-direction: column;
}

.traffic {
    height: 11%;
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


/*198*/
.connected-time {
    //height: 20%;
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