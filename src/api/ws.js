import { useSetupStore } from '@/stores/setup/index.js'
import { storeToRefs } from 'pinia'

const { setupInfo } = storeToRefs(useSetupStore())
const { host, secret } = setupInfo.value

export const connections = () => new WebSocket(`ws://${host}/connections?token=${secret}`)
export const logs = (level) => new WebSocket(`ws://${host}/logs?token=${secret}&level=${level}`)
export const traffic = () => new WebSocket(`ws://${host}/traffic?token=${secret}`)
