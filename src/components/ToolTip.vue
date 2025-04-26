<template>
  <!--  <Teleport to="slot">-->
  <div class="group relative">
    <slot />
    <div
      class="invisible absolute z-50 h-[19] rounded-[3px] px-1 text-[12px] opacity-0 group-hover:visible group-hover:opacity-100 group-hover:delay-1000"
      :class="{ light, dark, top, bottom, left, right }"
    >
      {{ tip }}
    </div>
  </div>
  <!--  </Teleport>-->
</template>

<script setup>
defineProps({
  tip: String,
  light: Boolean,
  dark: Boolean,
  top: Boolean,
  bottom: Boolean,
  left: Boolean,
  right: Boolean,
})
</script>

<style scoped>
.msg {
  z-index: 99999;
  visibility: hidden;
  opacity: 0;
  font-size: 12px;
  border-radius: 3px;
  position: absolute;
  height: 19px;
}

/*.a:hover .msg {*/
/*  visibility: visible;*/
/*  pointer-events: none; !* 防止隐藏时被误点 *!*/
/*  opacity: 1;*/
/*}*/

/*✅*/
.top {
  bottom: calc(100% + 5px);
}

/*✅*/
.right {
  left: calc(100% + 5px);
  bottom: calc((100% - 19px) / 2);
}

.left {
  right: calc(100% + 5px);
  bottom: calc((100% - 19px) / 2);
}

.light {
  background-color: #fff;
  color: #17224f;
  width: 225px;
  box-shadow: 3px 3px white;
}
.dark {
  background-color: #242424;
  color: white;
  text-wrap: nowrap;
}
</style>
