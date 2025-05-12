import axios from '@/plugins/axios/index.js'

export const getProxies = () => axios.get('/proxies')

export const getProxy = (proxiesName) => axios.get(`/proxies/${proxiesName}`)

export const getProviders = () => axios.get(`/providers/proxies`)

export const updateSelectedProxy = (name) =>
  axios.put(`/proxies/GLOBAL`, {
    name,
  })

export const getGroupList = () => axios.get('/group')

export const getGroupInfo = (groupName) => axios.get(`/group/${groupName}`)
export const getDelay = (name) => axios.get(`/${name}/delay`)
export const getGroup = () => axios.get(`/group`)
