<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSetupStore } from '@/stores/setup/index.js'
import { storeToRefs } from 'pinia'
import { setup } from '@/api/common.js'
const { setupInfo } = storeToRefs(useSetupStore())
const router = useRouter()
const failMsg = ref('')
const loginData = ref({ host: '', secret: '' })
function submit() {
  if (!setupInfo.value) {
    alert('请填写host')
  }
  setup(setupInfo.value)
    .then((res) => {
      setupInfo.value = loginData.value
      router.push('/')
    })
    .catch((err) => {
      console.log(err)

      // setupInfo.value = null
      failMsg.value = 'Failed to connect'
    })
}
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-start bg-[#ebebeb]">
    <img src="@/assets/Clash_Logo.png" class="logo h-64 w-64" />
    <div>
      <form class="flex flex-col" @submit.prevent="submit">
        <label>
          {{ $t('Host') }}
          <input v-model="loginData.host" placeholder="" type="text" @focus="failMsg = ''" />
          <span class="text-[#f56363]">{{ failMsg }}</span>
        </label>
        <label>
          {{ $t('Secret') }}
          <input type="password" v-model="loginData.secret" />
        </label>
        <button type="submit" class="bg-cyan-600 text-white">提交</button>
      </form>
      <div>中文|English</div>
    </div>
  </div>
</template>

<style scoped>
.logo:hover {
  filter: drop-shadow(0 0 2em #4f8bff);
}

label {
  margin: 3px;
}
</style>
