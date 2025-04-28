<script setup>
const props = defineProps({
  to: String,
})

defineEmits(['close'])
</script>

<template>
  <Teleport :to="props.to">
    <div
      @click.self="$emit('close')"
      class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-[rgba(0,0,0,0.482)]"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style scoped></style>
