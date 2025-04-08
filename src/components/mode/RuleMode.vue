<script setup>
import {getGroupList} from "@/api/group.js";
import {onMounted} from "vue";
import {useProxiesStore} from "@/stores/proxies.js";
import {storeToRefs} from "pinia";

const {group} = storeToRefs(useProxiesStore());
onMounted(() => {
  getGroupList().then(res => {
    console.log(res.data);
    group.value = res.data.proxies;

  })
})
</script>

<template>
  <div class="container">
    rule
  </div>

</template>

<style scoped>
.container {
}
</style>