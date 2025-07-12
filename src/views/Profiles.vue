<script setup>
import TopInfo from '@/components/TopInfo.vue'
import { ref } from 'vue'

const isSelect = ref(true)

function selectProfile() {
  isSelect.value = !isSelect.value
}
</script>

<template>
  <TopInfo style="display: flex; align-items: center">
    <div class="relative flex grow-1 items-center">
      <input :placeholder="$t('Download from a URL')" :class="$theme.input" />
      <span class="material-icons absolute right-[12px] text-[#7f7f7f] hover:cursor-pointer"
        >content_copy</span
      >
    </div>
    <div class="right">
      <button class="download">{{ $t('Download') }}</button>
      <button class="update">{{ $t('Update All') }}</button>
      <button class="import">{{ $t('Import') }}</button>
    </div>
  </TopInfo>
  <div
    class="mt-[14px] mr-[26px] ml-[36px] flex flex-wrap gap-x-[12px] gap-y-[8px] overflow-y-auto"
  >
    <div v-for="(item, index) in 1" :key="index" class="flex" @click="selectProfile">
      <div
        class="mr-[4px] h-[72px] w-[4px]"
        :class="{ 'bg-[#41b883]': isSelect, 'bg-[#dedede]': !isSelect }"
      ></div>
      <div
        class="flex h-[72px] max-w-[387px] min-w-[295px] flex-1 cursor-pointer items-center justify-between px-[8px]"
        :class="$theme.card"
      >
        <div class="flex flex-col justify-center">
          <span class="text-[15px]">config.yaml</span>
          <span class="text-[13px] text-[#808080]">local file (4 months)</span>
        </div>
        <!--        <span class="material-icons"> refresh </span>-->
        <span class="material-icons hover:bg-[#d6d6d6]"> code </span>
      </div>
    </div>
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
