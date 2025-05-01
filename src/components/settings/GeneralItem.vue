<script setup>
import OptionItem from '@/components/OptionItem.vue'
import ToolTip from '@/components/ToolTip.vue'
import SwitchOption from '@/components/SwitchOption.vue'
import SettingItem from '@/components/SettingItem.vue'
</script>

<template>
  <SettingItem title="General">
    <OptionItem label="Settings Editor">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right> cfw</template>
    </OptionItem>
    <OptionItem label="Notifications">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>
    <OptionItem label="Silent Start">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>
    <OptionItem label="Random Controller Port">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>

    <OptionItem label="Random Mixed Port">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>

    <OptionItem label="Lightweight Mode">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>

    <OptionItem label="GUI Log Folder">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>Open</template>
    </OptionItem>

    <OptionItem label="GUI Data Folder">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right> Open</template>
    </OptionItem>

    <OptionItem label="Check For Updates">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>

    <OptionItem label="Show New Version Icon">
      <template #left>
        <ToolTip>
          <span class="material-icons light-blue-grey near">info</span>
        </ToolTip>
      </template>
      <template #right>
        <SwitchOption :value="false"></SwitchOption>
      </template>
    </OptionItem>
  </SettingItem>
</template>

<style scoped></style>
