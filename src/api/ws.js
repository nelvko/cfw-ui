import storage from '@/hooks/storage.js'

const { host, secret } = storage.getLogin()

export const connections = new WebSocket(`ws://${host}/connections?token=${secret}`)
export const logs = new WebSocket(`ws://${host}/logs?token=${secret}`)
export const traffic = new WebSocket(`ws://${host}/traffic?token=${secret}`)
