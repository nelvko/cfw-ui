<script setup>
import TopInfo from '@/components/TopInfo.vue'
</script>

<template>
  <TopInfo style="display: flex; align-items: center">
    <div class="relative flex grow-1 items-center">
      <input placeholder="Download from a URL" />
      <span class="material-icons absolute right-[12px] text-[#7f7f7f] hover:cursor-pointer"
        >content_copy</span
      >
    </div>
    <div class="right">
      <button class="download">Download</button>
      <button class="update">Update All</button>
      <button class="import">Import</button>
    </div>
  </TopInfo>
  <div class="mt-[14px] ml-[36px] flex flex-wrap overflow-y-auto">
    <div
      style="height: 72px; background-color: #f4f4f4; margin-right: 12px; flex-grow: 1"
      v-for="(item, index) in 4"
      :key="index"
    ></div>
  </div>
</template>

<style scoped>
input:hover {
  cursor: auto;
}
input::placeholder {
  color: #a3a3a3;
  font-size: 16px;
}
input {
  height: 45px;
  margin-left: 35px;
  outline: none;
  flex-grow: 1;
  padding-left: 12px;
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
