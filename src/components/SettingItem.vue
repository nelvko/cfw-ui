<script setup>
defineProps({
  title: String,
})
</script>

<template>
  <div class="">{{ title }}</div>
  <div class="bg-[#f1f1f1]">
    <slot />
  </div>
</template>

<style scoped></style>
