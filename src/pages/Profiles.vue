<script setup>


import DivLine from "@/components/DivLine.vue";
</script>

<template>
  <div class="top">
    <input placeholder="Download from a URL"/>
    <button class="download">Download</button>
    <button class="update">Update All</button>
    <button class="import">Import</button>


  </div>
  <DivLine/>
</template>

<style scoped>
.top {
    height: 11%;
    display: flex;
    /*justify-content: center;*/
    align-items: center;
}
input{
}
button {
    border: #dcdcdc;
    background-color: #7e7b7b;
    color: white;
    height: 45px;
    width: 177px;
    margin-right: 10px;
}
.download {
    width: 86px;
}
.update {
    width: 88.5px;
}
.import{
    width: 65px;
}
input {
    height: 45px;
    margin-left: 35px;
    margin-right: 5px;
    outline: none;

}
</style>