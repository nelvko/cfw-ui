import axios from 'axios'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSetupStore } from '@/stores/setup/index.js'

const { setupInfo } = storeToRefs(useSetupStore())
const { host, secret } = setupInfo.value
const router = useRouter()
const instance = axios.create({
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  config.baseURL = `http://${host}`
  if (secret) {
    config.headers['Authorization'] = `Bearer ${secret}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (res) => {
    const { status } = res.response
    if (status === 401) {
      return router.push('/setup')
    }
    return res.response
  },
)

export default instance
