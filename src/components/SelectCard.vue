<script setup>
import { getDelay } from '@/api/proxies.js'

function delay(name) {
  getDelay(name).then((data) => {
    console.log(111, data)
  })
}
</script>

<template>
  <div class="proxies-item">
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
      <div class="right" @click="delay(item.name)">{{ 'check' }}</div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
