<script setup lang="ts">
import TopInfo from '@/components/TopInfo.vue'
import { computed, onActivated, ref } from 'vue'
import { getRules } from '@/api/rules.js'

const keyword = ref('')
const ruleList = ref([])
onActivated(() => {
  getRules().then(({ data }) => {
    console.log(data.rules)
    ruleList.value = data.rules
  })
})

const filterRuleList = computed(() => {
  const keywordValue = keyword.value
  return ruleList.value.filter(
    (item) =>
      item.payload?.match(keywordValue) ||
      item.proxy?.match(keywordValue) ||
      item.type?.match(keywordValue),
  )
})
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <TopInfo class="flex items-center gap-x-[16px] px-[20px]">
      <div class="flex flex-col">
        <span class="text-[20px]">{{ $t('Rules') }}</span>
        <span>{{ $t('Total') }}: {{ ruleList.length }}</span>
      </div>
      <input
        type="text"
        :placeholder="$t('Search')"
        v-model="keyword"
        class="h-[35px] flex-1 cursor-default rounded-[4px] pl-[12px]"
      />
    </TopInfo>
    <div class="overflow-y-auto" v-if="ruleList.length > 0">
      <div
        v-for="(item, index) in filterRuleList"
        :key="index"
        class="flex h-[40px] items-center border-b-[1px] border-b-[#eaeaea]"
      >
        <span class="ml-[20px] flex-1 text-[#808080]">{{ item.type }}</span>
        <span class="flex-1">{{ item.payload }}</span>
        <span class="flex-1">{{ item.proxy }}</span>
      </div>
    </div>

    <div
      v-else
      class="flex flex-1 cursor-default flex-col items-center justify-center text-[#808080]"
    >
      <span class="text-[18px]">Empty rule list</span>
    </div>
  </div>
</template>

<style scoped></style>
