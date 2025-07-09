<script setup>
const props = defineProps({
  value: Boolean,
  disabled: Boolean,
})

const emit = defineEmits(['handlerClick'])

function handlerSwitch() {
  if (props.disabled) return
  emit('handlerClick')
}
</script>

<template>
  <div
    class="flex h-[20px] w-[34px] items-center rounded-3xl bg-[#c7bfbf] px-[4px]"
    @click="handlerSwitch"
    :class="props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
  >
    <div
      class="size-[12px] rounded-full transition ease-linear"
      :class="value ? 'translate-x-[14px] bg-[#13af42]' : 'bg-[#d44545]'"
    ></div>
  </div>
</template>

<style scoped></style>
