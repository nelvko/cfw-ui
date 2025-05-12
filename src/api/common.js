import http from '@/plugins/axios'
import axios from 'axios'

export const getLogs = () => http.get('/logs')

export const getVersion = () => http.get('/version')

export const getTraffic = () => http.get('/traffic')

export const getMemory = () => http.get('/memory')

export const clearCache = () => http.post('/cache/fakeip/flush')

export const updateGeo = (data) => http.post('/geo')

export const restartKernel = (data) => http.patch('/restart', data)

export const setup = (login) => {
  return axios({
    baseURL: `http://${login.host}`,
    timeout: 2000,
    headers: { Authorization: `Bearer ${login.secret}` },
  })
}

export const closeAllConnections = () => http.delete('/connections')
export const closeConnection = (id) => http.delete(`/connections/${id}`)
