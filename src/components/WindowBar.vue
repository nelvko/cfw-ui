<script setup>
import {computed, ref} from "vue";

const isFull = ref(true);
const isKeep = ref(false);
const fullState = computed(() => {
  return isFull.value ? "close_fullscreen" : "check_box_outline_blank"
})

</script>

<template>
  <div class="window-bar">
    <span class="material-symbols-outlined light-blue-grey close">close</span>
    <span class="material-symbols-outlined light-blue-grey"
          @click="isFull=!isFull">{{ fullState }}
    </span>
    <span class="material-symbols-outlined light-blue-grey">remove</span>
    <span class="material-symbols-outlined light-blue-grey"
          @click="isKeep=!isKeep"
          :class="{keepActive:isKeep}">keep</span>
  </div>

</template>

<style scoped>
.window-bar {
    background-color: #EBEBEB;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    height: 24px;
    /*flex-shrink: 0;*/
} 

.material-symbols-outlined {
    font-variation-settings:
            'FILL' 1,
            'wght' 400,
            'GRAD' 0,
            'opsz' 20
}

.light-blue-grey {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3%;
    cursor: pointer;

    font-size: 0.9em;
    line-height: 100%;
    height: 100%;
}
.light-blue-grey:hover {
    background-color: #c6c6c6;
}

.close:hover {
    background-color: #fc6868;
}

.keepActive {
    color: #0c7d9d
}
</style>