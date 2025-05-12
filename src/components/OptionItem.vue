<script setup>
import SwitchOption from '@/components/SwitchOption.vue'

defineProps({
  label: String,
  value: {
    type: [String, Boolean],
    default: undefined,
  },
})
defineEmits(['clickValue'])
</script>

<template>
  <div class="flex justify-between p-[10px] hover:rounded-[4px] hover:bg-[#f1f1f1]">
    <div class="flex items-center">
      <div class="flex justify-center">{{ label }}</div>
      <slot name="left" />
    </div>
    <div class="flex cursor-pointer items-center">
      <slot name="right" />
      <div
        v-if="typeof value !== 'boolean'"
        @click.self="$emit('clickValue')"
        class="border-b border-dashed border-b-[#d6d6d6]"
      >
        {{ value }}
      </div>
      <switch-option class="ml-[7px]" v-else @click.self="$emit('clickValue')" :status="value" />
    </div>
  </div>
</template>

<style scoped></style>
