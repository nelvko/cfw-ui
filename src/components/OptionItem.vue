<script setup>
import SwitchOption from '@/components/SwitchOption.vue'

defineProps({
  label: String,
  value: [String, Boolean],
})
</script>

<template>
  <div class="option">
    <div class="left">
      <div class="label">{{ label }}</div>
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
      <div v-if="typeof value !== 'boolean'" class="string-value">
        {{ value }}
      </div>
      <div v-if="typeof value === 'boolean'" style="margin-left: 7px">
        <switch-option :status="value" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.option {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;

  .left {
    display: flex;
    align-items: center;

    .label {
      display: flex;
      justify-content: center;
    }
  }

  .right {
    display: flex;
    align-items: center;
    .string-value {
      border-bottom: 1px dashed #d6d6d6;
    }
  }
}

.option:hover {
  background-color: #f1f1f1;
  border-radius: 4px;
}
</style>
