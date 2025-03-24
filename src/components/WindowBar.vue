<script setup>
import {ref} from "vue";

const isFull = ref(true);
const clickKeep = () => {
  keepSrc.value = keepSrc.value === keep ? keepActive : keep
}
</script>

<template>
  <div class="window-bar">
    <span class="material-symbols-outlined icon">close</span>
    <span class="material-symbols-outlined icon"
          v-if="isFull">close_fullscreen</span>
    <span class="material-symbols-outlined icon"
          v-if="isFull===false">check_box_outline_blank</span>
    <span class="material-symbols-outlined icon">remove</span>
    <span class="material-symbols-outlined icon">keep</span>
  </div>

</template>

<style scoped>

/*.material-symbols-outlined {*/
/*    font-variation-settings:*/
/*            'FILL' 1,*/
/*            'wght' 400,*/
/*            'GRAD' 0,*/
/*            'opsz' 20*/
/*}*/
.window-bar {
background-color: #EBEBEB;
display: flex;
align-items: center;
flex-direction: row-reverse;
}


.icon {
display: flex;
justify-content: center;
align-items: center;
width: 3%;
cursor: pointer;

}

.icon:hover {
background-color: #c6c6c6;
}

.icon-close:hover {
background-color: #fc6868;
}
</style>