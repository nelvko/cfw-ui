<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSetupStore } from '@/stores/setup/index.js'
import { storeToRefs } from 'pinia'
import { setup } from '@/api/common.js'
import { switchLanguage } from '@/hooks/switchLanguage.js'

const { setupInfo } = storeToRefs(useSetupStore())
const router = useRouter()
const failMsg = ref('')
function submit() {
  if (!setupInfo.value.host) {
    alert('请填写host')
  }
  setup(setupInfo.value)
    .then(() => {
      router.push('/')
    })
    .catch((err) => {
      console.log('err', err)

      setupInfo.value = {}
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
          <input
            v-model="setupInfo.host"
            placeholder="127.0.0.1"
            type="text"
            @focus="failMsg = ''"
          />
          <span class="text-[#f56363]">{{ failMsg }}</span>
        </label>
        <label>
          {{ $t('Port') }}
          <input type="text" placeholder="9090" v-model="setupInfo.port" />
        </label>
        <label>
          {{ $t('Secret') }}
          <input type="password" v-model="setupInfo.secret" />
        </label>
        <button type="submit" class="bg-cyan-600 text-white">{{ $t('Submit') }}</button>
      </form>
      <div @click="switchLanguage">中文|English</div>
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
