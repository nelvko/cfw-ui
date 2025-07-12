<script setup>
import { ref, watch } from 'vue'
import { getProviders } from '@/api/proxies.js'

const props = defineProps({
  activeMode: null,
})
const groupNameList = ref([])
const show = ref(false)

function format(str) {
  if (show.value) {
    return str
  }
  // return str.trim()[4]
  return 'P'
}

watch(
  () => props.activeMode,
  (newVal) => {
    groupNameList.value.length = 0
    if (newVal === 'global') {
      return groupNameList.value.push('global'.toUpperCase())
    } else if (newVal === 'direct') return
    getProviders().then((res) => {
      console.log(res.data)

      for (let key in res.data.providers) {
        console.log(key)
        if (key !== 'default') {
          groupNameList.value.push(key)
        }
      }
    })
  },
)
</script>

<template>
  <div
    @mouseleave="show = false"
    :class="{ a: show }"
    class="absolute right-[18px] flex h-full flex-col justify-center border-l-transparent bg-transparent pr-[5px] text-[12px] transition-[width] duration-10000 ease-in hover:bg-white"
  >
    <span
      class="text-[#808080]"
      v-for="(groupName, index) in groupNameList"
      :key="index"
      @mouseover="show = true"
      >{{ format(groupName) }}</span
    >
  </div>
</template>

<style scoped>
.a {
  @apply w-[80px] border-l border-l-[#dcdcdc] pl-[5px];
}
/*text-[#a0dcc1]*/
</style>
