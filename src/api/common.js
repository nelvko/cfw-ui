import http from '@/config/http.js'
import axios from 'axios'

export const getLogs = () => http.get('/logs')

export const getVersion = () => http.get('/version')

export const getTraffic = () => http.get('/traffic')

export const getMemory = () => http.get('/memory')

export const clearCache = () => http.post('/cache/fakeip/flush')

export const getConfig = () => http.get('/configs')

export const reloadConfig = () => http.put('/configs?force=true')

export const updateConfig = (data) => http.patch('/configs', data)

export const updateGeo = (data) => http.post('/geo')

export const restartKernel = (data) => http.patch('/restart', data)

export const testLogin = (login) => {
  console.log(login)

  return axios({
    baseURL: `http://${login.host}`,
    timeout: 1000,
    headers: { Authorization: `Bearer ${login.secret}` },
  })
}
