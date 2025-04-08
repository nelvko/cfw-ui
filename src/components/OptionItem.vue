<script setup>
import SwitchOption from "@/components/SwitchOption.vue";
import {useTemplateRef} from "vue";

const tip = useTemplateRef("toolTip");
defineProps({
  label: String,
  stringValue: String,
  isSwitch: Boolean,
  switchValue: Boolean,
})

</script>

<template>
  <div class="option">
    <div class="left">
      <div class="label">{{ label }}</div>
      <slot name="left-icon"/>
    </div>
    <div class="right">
      <slot name="right-icon"/>
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
            border-bottom: 1px dashed #D6D6D6;
        }
    }


}

.option:hover {
    background-color: #F1F1F1;
    border-radius: 4px;
}
</style>
