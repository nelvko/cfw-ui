<script setup>
import MenuBar from "/src/components/MenuBar.vue";
import WindowBar from "@/components/WindowBar.vue";


</script>

<template>
  <div class="container">
    <window-bar class="window-bar"/>
    <div class="view">
      <menu-bar class="menu-bar"></menu-bar>
      <div class="content">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    /*height: 100vh;*/
    /*width: 100vw;*/
    height: 100%;
    width: 100%;

    .window-bar {
        height: 3.2%;
    }

    .view {
        display: flex;
        flex-grow: 1;

        .menu-bar {
            width: 11.8%;
        }

        .content {
            flex-grow: 1;
        }
    }
}
</style>
