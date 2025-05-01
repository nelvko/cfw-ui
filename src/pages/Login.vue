<script setup>
import { onMounted, ref } from 'vue'
import { login } from '@/api/common.js'
import { useRouter } from 'vue-router'
import { useLoginStore } from '@/stores/login/index.js'
import { storeToRefs } from 'pinia'

const router = useRouter()
const failMsg = ref('')
const loginStore = useLoginStore()
onMounted(() => {
  console.log(111, loginStore.activeMenu)
  console.log(111, loginStore.loginInfo)
})
function submit() {
  if (!loginInfo.value.host) {
    alert('请填写host')
  }
  login(loginInfo.value)
    .then((res) => {
      console.log(res)
      router.push('/')
    })
    .catch((err) => {
      console.log(err)

      loginInfo.value = null
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
          <!--          <input v-model.trim="loginInfo.host" placeholder="" type="text" @focus="failMsg = ''" />-->
          <span class="text-[#f56363]">{{ failMsg }}</span>
        </label>
        <label>
          密码：
          <!--          <input type="password" v-model.trim="loginInfo.secret" />-->
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
