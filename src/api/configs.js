import axios from '@/plugins/axios/index.js'
import http from '@/plugins/axios/index.js'

export const getConfig = () => http.get('/configs')

export const reloadConfig = () => http.put('/configs?force=true')

export const updateConfig = (data) => http.patch('/configs', data)

export const updateMode = (mode) => axios.patch(`/configs`, { mode })

export const getMode = () => getConfig().then((res) => res.data.mode)
