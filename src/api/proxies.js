import axios from '@/plugins/axios/index.js'
import { useSettingsStore } from '@/stores/settings/settings.js'
import { storeToRefs } from 'pinia'

export const getProxies = () => axios.get('/proxies')

export const getProxy = (proxiesName) => axios.get(`/proxies/${proxiesName}`)

export const getProviders = () => axios.get(`/providers/proxies`)

export const updateSelectedProxy = (name) =>
  axios.put(`/proxies/GLOBAL`, {
    name,
  })

export const getGroupList = () => axios.get('/group')

export const getGroupInfo = (groupName) => axios.get(`/group/${groupName}`)
export const getDelay = (name) => {
  const { testLatency } = storeToRefs(useSettingsStore())

  return axios.get(`/proxies/${name}/delay`, {
    params: {
      timeout: testLatency.value.timeout,
      url: testLatency.value.url,
    },
  })
}

export const getGroup = () => axios.get(`/group`)
