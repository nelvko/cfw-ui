<script setup>
import TopInfo from '@/components/TopInfo.vue'
</script>

<template>
  <div class="profiles">
    <TopInfo style="display: flex; align-items: center">
      <div class="left">
        <input placeholder="Download from a URL" />
        <span class="material-symbols-outlined copy">content_copy</span>
      </div>
      <div class="right">
        <button class="download">Download</button>
        <button class="update">Update All</button>
        <button class="import">Import</button>
      </div>
    </TopInfo>
    <div class="view">
      <div
        style="height: 72px; background-color: #f4f4f4; margin-right: 12px; flex-grow: 1"
        v-for="(item, index) in 4"
        :key="index"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-wrap: wrap;
  margin-left: 36px;
}

.profiles {
  display: flex;
  flex-direction: column;
}

input:hover {
  cursor: auto;
}

input::placeholder {
  color: #a3a3a3;
  font-size: 16px;
}

.left {
  display: flex;
  align-items: center;
  flex-grow: 1;
  position: relative;
}

input {
  height: 45px;
  margin-left: 35px;
  outline: none;
  flex-grow: 1;
  padding-left: 12px;
}

.copy {
  transform: rotateX(180deg);
  position: absolute;
  right: 12px;
  color: #7f7f7f;
}

.copy:hover,
button:hover {
  cursor: pointer;
}

.right {
  margin-right: 35px;
}
button {
  border: #dcdcdc;
  background-color: #7e7b7b;
  color: white;
  height: 45px;
  width: 177px;
  margin: 0 5px;
  border-radius: 3px;
}
.download {
  width: 86px;
}
.update {
  width: 88.5px;
}

.import {
  width: 65px;
}
</style>
