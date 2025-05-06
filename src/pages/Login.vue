<script setup>
import { ref } from 'vue'
import { login } from '@/api/common.js'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login/index.js'
import { storeToRefs } from 'pinia'

const { loginInfo } = storeToRefs(useLoginStore())
const router = useRouter()
const failMsg = ref('')
const loginData = ref({ host: '127.0.0.1:9090', secret: '' })
function submit() {
  if (!loginData.value) {
    alert('请填写host')
  }
  login(loginData.value)
    .then((res) => {
      loginInfo.value = loginData.value
      router.push('/')
    })
    .catch((err) => {
      console.log(err)

      // loginInfo.value = null
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
          主机：
          <input v-model="loginData.host" placeholder="" type="text" @focus="failMsg = ''" />
          <span class="text-[#f56363]">{{ failMsg }}</span>
        </label>
        <label>
          密码：
          <input type="password" v-model="loginData.secret" />
        </label>
        <button type="submit" class="bg-cyan-600 text-white">提交</button>
      </form>
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
