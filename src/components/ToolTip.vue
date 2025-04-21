<template>
  <div class="tool-tip">
    <slot/>
    <div class="msg"
         :class="{light,dark,top,bottom,left,right}">{{ msg }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  msg: String,
  light: Boolean,
  dark: Boolean,
  top: Boolean,
  bottom: Boolean,
  left: Boolean,
  right: Boolean,
})


</script>

<style scoped>
.tool-tip {
    position: relative;
    z-index: 9999;
}

.msg {
    visibility: hidden;
    opacity: 0;

    /*visibility: visible;*/
    /*opacity: 1;*/
    /*background-color: pink;*/
    position: absolute;
    z-index: 999;
}
.top{
    top: calc(-100% + 5px);
    bottom: calc(100% + 5px);
}
.right {
    top: calc(-100% + 5px);
    left: calc(100% + 5px);
}

.tool-tip1:hover .msg {
    visibility: visible;
    /*pointer-events: none; !* 防止隐藏时被误点 *!*/
    opacity: 1;
}

.light {
    /*background-color: #fff;*/
    background-color: pink;
}

.dark {
    background-color: #242424;
}
</style>
