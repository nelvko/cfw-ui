<script setup>
import { storeToRefs } from 'pinia'
import { useProxiesStore } from '@/stores/proxies.js'
import { updateSelectedProxy } from '@/api/proxies.js'
import { obj } from '@/api/demo.js'
import { ref } from 'vue'
import ToolTip from '@/components/ToolTip.vue'
defineProps({
  groupName: String,
})
const { selectedProxy } = storeToRefs(useProxiesStore())

const isShow = ref(true)

function selectProxy(proxy) {
  selectedProxy.value = proxy
  updateSelectedProxy(proxy)
}
</script>

<template>
  <div class="proxy-groups">
    <div class="top-info" @click="isShow = !isShow">
      <div class="proxy">
        <div>GLOBAL</div>
        <div class="type">S</div>
        <div>香港 03</div>
      </div>
      <div class="icon">
        <ToolTip dark msg="Scroll to selected proxy" top>
          <span class="material-icons a">travel_explore</span>
        </ToolTip>
        <ToolTip dark tip="Show/Hide timed-out proxies" top>
          <span class="material-icons a">report</span>
        </ToolTip>
        <ToolTip dark tip="Test latency" top>
          <span class="material-icons a">network_check</span>
        </ToolTip>
        <ToolTip dark left tip="Show/hide proxies">
          <span class="material-icons a">visibility_off</span>
        </ToolTip>
        <ToolTip dark left tip="Show/hide proxies">
          <span class="material-icons a">visibility</span>
        </ToolTip>
      </div>
    </div>
    <div class="proxies-view" v-if="isShow">
      <div
        v-for="item in obj.providers[groupName].proxies"
        class="proxies-item"
        @click="selectProxy(item.name)"
      >
        <div class="select" :class="{ selected: item.name === selectedProxy }" />

        <div class="info">
          <div class="left">
            <div>{{ item.name }}</div>
            <div class="protocol" style="display: flex">
              <div class="type">
                {{ item.type }}
              </div>
              <div class="udp" v-if="item.udp">UDP</div>
            </div>
          </div>
          <div class="right">check</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.proxy-groups {
  display: flex;
  flex-direction: column;
  background: #fff;
  position: relative;
}

.material-icons {
  font-variation-settings: 'FILL' 1;
  font-size: 16px;
}
.top-info {
  height: 44px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 30px 4px;
  position: sticky;
  top: 0;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;

  .proxy {
    display: flex;
    align-items: center;

    .type {
      background-color: #41b883;
      color: #fff;
      width: 14px;
      height: 15px;
      box-sizing: border-box;
      border-radius: 2px;
      justify-content: center;
      align-items: center;
      display: flex;
      /*padding: 4px;*/
    }
  }

  .proxy > div {
    margin: 0 5px;
  }

  .icon {
    display: flex;
    align-items: center;
  }

  /*.icon > span {*/

  .a {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 30px;
    box-sizing: border-box;
    border-radius: 5px;
  }

  /*.icon > span:hover {*/

  .a:hover {
    background-color: #d6d6d6;
  }
}

.top-info:hover {
  background-color: #f1f1f1;
}

.proxies-view {
  display: flex;
  flex-wrap: wrap;
  margin-left: 36px;
  height: 100%;
  /*position: relative;*/
}

.proxies-item {
  margin-bottom: 8px;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  cursor: pointer;

  .select {
    height: 56px;
    width: 4px;
    background-color: #dedede;
    margin-right: 4px;
    cursor: pointer;
  }

  .selected {
    background-color: #41b883;
  }

  .info {
    width: 382px;
    /*min-width: 287px;*/
    background-color: #f4f4f4;
    height: 56px;
    display: flex;
    justify-content: space-between;
    /*align-content: center;*/
    cursor: pointer;

    .left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 15px;
    }

    .right {
      display: flex;
      align-items: center;
      margin-right: 15px;
    }
  }
}
.type {
  color: #808080;
  font-size: 0.6em;
}

.udp {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 16px;
  width: 28px;
  color: #808080;
  font-size: 0.3em;
  border-radius: 3px;
  border: 1px solid #d5d5d5;
  margin-left: 6px;
}
</style>
