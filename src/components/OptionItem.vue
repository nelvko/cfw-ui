<script setup>
defineProps({
  label: String,
  value: {
    type: [Number, String],
  },
})
</script>

<template>
  <div class="flex justify-between p-[10px] hover:rounded-[4px]" :class="$theme.optionItem">
    <div class="flex items-center">
      <div class="flex justify-center">{{ label }}</div>
      <slot name="left" />
    </div>
    <div class="flex items-center">
      <slot name="right" />
      <div
        v-if="value"
        @click.self="$emit('handler-click')"
        class="cursor-pointer border-b border-dashed border-b-[#d6d6d6]"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
