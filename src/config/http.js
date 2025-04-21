import axios from 'axios'
import storage from '@/hooks/storage.js'

const { baseurl, secret } = storage.getLogin()
export default axios.create({
  baseURL: `http://${baseurl}`,
  timeout: 10000,
  headers: { Authorization: `Bearer ${secret}` },
})
