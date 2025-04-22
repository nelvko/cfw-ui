import axios from 'axios'
import storage from '@/hooks/storage.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const instance = axios.create({
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  const { host, secret } = storage.getLogin()
  config.baseURL = `http://${host}`
  if (secret) {
    config.headers['Authorization'] = `Bearer ${secret}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res.data,
  (res) => {
    const { status } = res.response
    if (status === 401) {
      router.push('/login')
    }
  }
)

export default instance
