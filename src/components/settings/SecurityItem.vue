<script setup>
import OptionItem from '@/components/OptionItem.vue'
import ToolTip from '@/components/ToolTip.vue'
import SettingItem from '@/components/SettingItem.vue'
</script>

<template>
  <SettingItem title="Security">
    <OptionItem label="Core Secret">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right> Update</template>
    </OptionItem>
    <OptionItem label="Allow Unsafe URLs">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right> Edit</template>
    </OptionItem>
  </SettingItem>
</template>

<style scoped></style>
