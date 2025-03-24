<script setup>

defineProps({
  speed:Number,
  type:String,
  unit:String
})
</script>

<template>
  <div>
    <div style="display: flex;justify-content: space-around;">
      <span>{{type}}</span>
      <span>{{ speed }}</span>
      <span>{{unit}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>