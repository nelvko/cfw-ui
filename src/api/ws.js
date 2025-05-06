import { useLoginStore } from '@/stores/login/index.js'
import { storeToRefs } from 'pinia'

const { loginInfo } = storeToRefs(useLoginStore())
const { host, secret } = loginInfo.value

export const connections = new WebSocket(`ws://${host}/connections?token=${secret}`)
export const logs = new WebSocket(`ws://${host}/logs?token=${secret}`)
export const traffic = new WebSocket(`ws://${host}/traffic?token=${secret}`)
