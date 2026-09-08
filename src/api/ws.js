import { useSettings } from '../store/settings'

export function createWS(path) {
  const { backend } = useSettings.getState()
  const token = backend.secret ? `token=${encodeURIComponent(backend.secret)}` : ''
  const sep = path.includes('?') ? (token ? '&' : '') : token ? '?' : ''
  return new WebSocket(`ws://${backend.host}:${backend.port}${path}${sep}${token}`)
}

export const createTrafficWS = () => createWS('/traffic')

export const createLogsWS = (level) => createWS(`/logs?level=${level}`)

export const createConnectionsWS = () => createWS('/connections')
