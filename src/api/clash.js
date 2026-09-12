import { api } from './client'

// 与老项目 api/*.js 对应的 clash RESTful 接口
export const getVersion = () => api.get('/version')

export const getConfigs = () => api.get('/configs')

export const patchConfigs = (data) => api.patch('/configs', data)

export const getProxies = () => api.get('/proxies')

export const selectProxy = (group, name) =>
  api.put(`/proxies/${encodeURIComponent(group)}`, { name })

export const getDelay = (name, url, timeout) =>
  api.get(
    `/proxies/${encodeURIComponent(name)}/delay?timeout=${timeout}&url=${encodeURIComponent(url)}`,
  )

export const getRules = () => api.get('/rules')

export const getProviders = () => api.get('/providers/rules')

export const closeConnection = (id) => api.del(`/connections/${encodeURIComponent(id)}`)

export const closeAllConnections = () => api.del('/connections')

export const updateGeo = () => api.post('/geo')
