<script setup>

import {onMounted} from "vue";
import {getLogs} from "@/api/common.js";

onMounted(()=>{
  getLogs().then(res => {
    console.log(res.data);
  })
    }
)
</script>

<template>
log
</template>

<style scoped>

</style>