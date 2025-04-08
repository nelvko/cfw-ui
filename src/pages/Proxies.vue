<script setup>
import DivLine from "@/components/DivLine.vue";
import {onMounted, ref} from "vue";
import GlobalMode from "@/components/mode/GlobalMode.vue";
import RuleMode from "@/components/mode/RuleMode.vue";
import DirectMode from "@/components/mode/DirectMode.vue";

const modeList = [
  {name: "Global", icon: "merge"},
  {name: "Rule", icon: "alt_route"},
  {name: "Direct", icon: "north"},
  {name: "Script", icon: "alt_route"}
]

const modeIndex = ref(0)

function switchMode(index) {
  modeIndex.value = index;
  console.log(modeIndex.value)
}

</script>

<template>
  <div class="container">
    <div class="mode-view">
      <div v-for="(item,index) in modeList"
           :key="index"
           @click="switchMode(index)"
           :class="{modeActive: modeIndex === index}"
           class="mode-item">
        <div>{{ item.name }}</div>
        <span class="material-symbols-outlined ">{{ item.icon }}</span>
      </div>
    </div>
    <DivLine/>
    <div class="proxies-view">
      <GlobalMode v-if="modeIndex===0"/>
      <RuleMode v-if="modeIndex===1"/>
      <DirectMode v-if="modeIndex===2"/>
      <div v-if="modeIndex===3">
        script
      </div>
    </div>
  </div>

</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}

.material-symbols-outlined {
    transform: rotate(90deg);
    margin-left: 7px;
}

.mode-view {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 79px;
    box-sizing: border-box;
}

.mode-item {
    margin: 0 20px;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 120px;
    color: #747474;
    cursor: pointer;
}

.mode-item * {
    cursor: pointer;
}

.modeActive {
    background-color: #4C4B4B;
    color: #fff;
}

.proxies-view {
    flex-grow: 1;
}
</style>