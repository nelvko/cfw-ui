<template>
  <Transition>
    <div>
      {{content}}
    </div>
  </Transition>
</template>

<script setup>
import {ref} from "vue";


defineProps({
  content: String,
});
</script>

<style scoped>

</style>
