import axios from 'axios'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/stores/login/index.js'

const { loginInfo } = storeToRefs(useLoginStore())
const { host, secret } = loginInfo.value
const router = useRouter()
const instance = axios.create({
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  config.baseURL = `http://${host}`
  if (secret) {
    config.headers['Authorization'] = `Bearer ${secret}`
  }
  console.log('请求拦截', config)

  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  (res) => {
    console.log('响应拦截', res)

    const { status } = res.response
    if (status === 401) {
      router.push('/login')
    }
  }
)

export default instance
