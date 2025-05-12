<script setup lang="ts"></script>

<template>
  <div class="min-h-[239px] w-[390px] bg-white *:px-[20px]">
    <div class="flex h-[80px] flex-col justify-evenly">
      <div class="text-xl">Change Mixed Port</div>
      <div class="text-[#179bbb]">mixed = http + socks</div>
    </div>
    <div class="flex h-[88px] flex-col justify-between border-t border-t-[#e9e9e9] py-[10px]">
      <div>New Port</div>
      <input
        type="text"
        class="h-[43px]"
        v-model.number="mixedPort"
        :placeholder="config['mixed-port']"
      />
    </div>
    <div class="border-t border-t-[#e9e9e9] pt-[10px] pb-[20px]">
      <div class="text-[#ff0000]" v-show="isMixedPortError">
        Port must be an integer between 0 to 65353
      </div>
      <div class="flex justify-evenly text-white *:h-[40px] *:w-[100px]">
        <button class="bg-[#676475]" @click="isChangeMixedPort = false">Cancel</button>
        <button class="bg-[#3e3c4d]" @click="changeMixedPort">OK</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
