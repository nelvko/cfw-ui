import storage from '@/hooks/storage.js'

let baseurl = storage.getLogin().baseurl
console.log(111, baseurl)

if (!baseurl) {
  baseurl = 'localhost:9090'
}

export const connections = new WebSocket(`ws://${baseurl}/connections`)
export const logs = new WebSocket(`ws://${baseurl}/logs`)
