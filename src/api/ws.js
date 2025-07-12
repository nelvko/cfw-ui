import { useSetupStore } from '@/stores/setup/index.js'
import { storeToRefs } from 'pinia'

const { setupInfo } = storeToRefs(useSetupStore())
const { host, port, secret } = setupInfo.value
const prefix = `ws://${host}:${port}`
const suffix = `?token=${secret}`

export const createConnectionWebSocket = () => new WebSocket(`${prefix}/connections${suffix}`)

export const createLogWebSocket = (level) => new WebSocket(`${prefix}/logs${suffix}&level=${level}`)

export const createTrafficWebSocket = () => new WebSocket(`${prefix}/traffic${suffix}`)
