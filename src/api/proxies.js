import axios from "@/config/http.js";

export const getProxies = () =>
    axios.get('/proxies')


export const getProxy = (proxiesName) =>
    axios.get(`/proxies/${proxiesName}`)

export const getProviders = () =>
    axios.get(`/providers/proxies`)

export const updateSelectedProxy = (name) =>
    axios.put(`/proxies/${name}`)

   