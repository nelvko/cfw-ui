import http from '@/plugins/axios/index.js'

export const getConfig = () => http.get('/configs')

export const reloadConfig = () => http.put('/configs?force=true')

export const updateConfig = (data) => http.patch('/configs', data)

export const updateMode = (mode) => http.patch(`/configs`, { mode })
export const updateLogLevel = (level) => http.patch(`/configs`, { 'log-level': level })
export const updateAllowLan = (val) => {
  console.log('before', val)
  return http.patch(`/configs`, { 'allow-lan': val })
}

export const getMode = () => getConfig().then((res) => res.data.mode)
