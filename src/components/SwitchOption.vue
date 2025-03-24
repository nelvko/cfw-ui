<script setup>

defineProps({
  status: Boolean
})
</script>

<template>
  <label class="switch">
    <input type="checkbox"
          />
    <span class="slider"></span>
  </label>
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
    background-color: #C7BFBF; /* 默认填充灰色 */
    transition: .1s;
    border-radius: 24px;
}

.slider::before {
    content: "";
    position: absolute;
    height: 17px;
    width: 17px;
    left: 4px;
    bottom: 3px;
    background-color: #D44545; /* 默认关闭状态红色 */
    transition: .1s;
    border-radius: 50%;
}

input:checked + .slider::before {
    background-color: #13AF42; /* 开启状态绿色 */
    transform: translateX(16px);
}


</style>