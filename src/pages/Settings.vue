<script setup>
import TopInfo from '@/components/TopInfo.vue'
import SettingItem from '@/components/SettingItem.vue'
import OptionItem from '@/components/OptionItem.vue'
import ToolTip from '@/components/ToolTip.vue'
</script>

<template>
  <TopInfo class="flex items-center justify-between px-[20px]">
    <div class="text-[20px]">Settings</div>
    <div class="btn">
      <span>Reset All Settings</span>
      <span>Force Quit</span>
      <span>Quit</span>
    </div>
  </TopInfo>
  <div class="mx-6">
    <SettingItem title="Security">
      <OptionItem label="Core Secret" string-value="Update">
        <template #left-icon>
          <ToolTip>
            <span class="material-icons light-blue-grey near">info</span>
          </ToolTip>
        </template>
      </OptionItem>
    </SettingItem>
  </div>
</template>

<style scoped>
:root {
  --spacing: 0.25rem;
}

.btn > span {
  color: #fa1313;
  background-color: #f1f1f1;
  height: 31px;
  box-sizing: border-box;
  border-radius: 3px;
  margin-left: 10px;
  padding: 4px 14px;
}
</style>
