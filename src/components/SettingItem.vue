<script setup>
defineProps({
  title: String,
})
</script>

<template>
  <div>{{ title }}</div>
  <div class="bg-[#084a5a]">
    <slot />
  </div>
</template>

<style scoped></style>
