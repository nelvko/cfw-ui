<script setup>
import { ref } from 'vue'
import { testLogin } from '@/api/common.js'

const login = ref({})

function submit() {
  if (!login.value.host) {
    alert('no')
  }
  testLogin(login.value)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
      alert(err.response.data.message)
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
          <input type="text" v-model.trim="login.host" autocomplete />
        </label>
        <label>
          密码：
          <input type="password" v-model.trim="login.secret" />
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
