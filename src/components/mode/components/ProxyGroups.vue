<script setup>
import {storeToRefs} from "pinia";
import {useProxiesStore} from "@/stores/proxies.js";
import {updateSelectedProxy} from "@/api/proxies.js";

defineProps({
  groupName: String
})
const {providers, selectedProxy} = storeToRefs(useProxiesStore());



function selectProxy(proxy) {
  selectedProxy.value = proxy
  updateSelectedProxy(proxy)

}
</script>

<template>
  <div class="top-info">
    <div class="">
        <span>
          {{ groupName }}
        </span>
      <span style="background-color: #41b883;color: #fff;width: 14px;height: 15px">
          s
        </span>
      <span>
          {{ groupName }}
        </span>

    </div>
    <div class="">
      <span class="material-symbols-outlined">travel_explore</span>
      <span class="material-symbols-outlined">report</span>
      <span class="material-symbols-outlined">network_check</span>
    </div>
  </div>
  <div class="proxies-view">
    <!--      <span style="position: absolute">G</span>-->
    <div v-for="(item) in providers[groupName].proxies"
         class="proxies-item"
         @click="selectProxy(item.name)">


      <div class="select"
           :class="{selected:item.name===selectedProxy}"
      />
      <div class="info">
        <div class="left">
          <div>{{ item.name }}</div>
          <div class="protocol"
               style="display: flex;">
            <div class="type">
              {{ item.type }}
            </div>
            <div class="udp"
                 v-if="item.udp">
              UDP
            </div>
          </div>
        </div>
        <div class="right">
          check
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
    font-variation-settings: 'FILL' 1;
    font-size: 16px;

}


.top-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 8px 30px 4px;
    height: 44px;
    box-sizing: border-box;
    border-radius: 5px;
    /*position: fixed;*/
    /*top: 0;*/

}

.top-info:hover {
    background-color: #f1f1f1;
}

.proxies-view {
    display: flex;
    flex-wrap: wrap;
    margin-left: 36px;
    position: relative;
    overflow: hidden;
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