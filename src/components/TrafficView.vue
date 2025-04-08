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
      <span class="material-symbols-outlined">{{ type }}</span>
      <span>{{ speed }}</span>
      <span style="font-size: 12px">{{unit}}</span>
    </div>
  </div>
</template>

<style scoped>

</style>