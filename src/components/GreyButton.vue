<script setup>

</script>

<template>
  <div class="button">
    <slot/>
  </div>
</template>

<style scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #b1b1b1;
    height: 28PX;
    width: 65px;
    box-sizing: border-box;
    margin-right: 5px;
    color: white;
    border-radius: 3px;
}
.active{
    background-color: #1ebc4d;
}
</style>