<script setup>
import { ref } from 'vue'

const props = defineProps({
  value: Boolean,
})
const switchValue = ref(props.value)
</script>

<template>
  <div
    class="flex h-[20px] w-[34px] items-center rounded-3xl bg-[#c7bfbf] px-[4px]"
    @click="switchValue = !switchValue"
  >
    <div
      class="size-[12px] rounded-full transition ease-linear"
      :class="switchValue ? 'translate-x-[14px] bg-[#13af42]' : 'bg-[#d44545]'"
    ></div>
  </div>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #c7bfbf; /* 默认填充灰色 */
  transition: 0.1s;
  border-radius: 24px;
}

.slider::before {
  content: '';
  position: absolute;
  height: 17px;
  width: 17px;
  left: 4px;
  bottom: 3px;
  background-color: #d44545; /* 默认关闭状态红色 */
  transition: 0.1s;
  border-radius: 50%;
}

input:checked + .slider::before {
  background-color: #13af42; /* 开启状态绿色 */
  transform: translateX(16px);
}
</style>
