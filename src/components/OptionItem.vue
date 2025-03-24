<script setup>
import SwitchOption from "@/components/SwitchOption.vue";
import ToolTip from "@/components/ToolTip.vue";
import {ref, useTemplateRef} from "vue";

const tip = useTemplateRef("toolTip");
const isShowTip=ref(false)
defineProps({
  label: String,
  stringValue: String,
  switchValue: Boolean,
  isSwitch: Boolean,
  iconInfoTip: String,
  iconSettingsTip: String
})

</script>

<template>
  <div class="option">
    <div class="left">
      <div class="label">{{ label }}</div>
      <img src="@/assets/info.svg"
           @mouseover="isShowTip = true"
           style="height: 1em"
           v-if="iconInfoTip"
           alt="info"/>
    </div>
    <div class="right">
      <div v-if="stringValue"
           class="string-value">
        {{ stringValue }}
      </div>
      <div v-if="isSwitch"
           style="margin-left: 7px">
        <switch-option :status="switchValue"/>
      </div>
    </div>
  </div>
  <ToolTip 
          ref="toolTip"
          :show="isShowTip"
  
  />


</template>

<style scoped>


.option {
    display: flex;
    justify-content: space-between;
    padding: 10px 10px;

    .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .label {
            display: flex;
            justify-content: center;
        }
    }

    .right {
        display: flex;

        .string-value {
            border-bottom: 1px dashed #D6D6D6;
        }
    }


}

.option:hover {
    background-color: #F1F1F1;
    border-radius: 4px;
}


</style>
