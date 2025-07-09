import axios from '@/plugins/axios/index.js'

export const getRules = () => {
  return axios.get(`/rules`)
}
