import axios from "@/config/http.js";

export const getLogs = () =>
    axios.get('/logs')



export const getVersion = () =>
    axios.get('/version')

export const getTraffic = () =>
    axios.get('/traffic')

export const getMemory = () =>
    axios.get('/memory')


export const clearCache = () =>
    axios.post('/cache/fakeip/flush')


export const getConfig = () =>
    axios.get('/configs')

export const reloadConfig = () =>
    axios.put('/configs?force=true')

export const updateConfig = (data) =>
    axios.patch('/configs', data)


export const updateGeo = (data) =>
    axios.post('/geo')

export const restartKernel = (data) =>
    axios.patch('/restart', data)

