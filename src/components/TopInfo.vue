<script setup></script>

<template>
  <div class="top-info">
    <slot />
  </div>
</template>

<style scoped>
.top-info {
  height: 80px;
  box-sizing: border-box;
  border-bottom: 1px solid #dcdcdc;
  flex-shrink: 0;
}
</style>
