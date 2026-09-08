import { useSettings } from '../store/settings'

function base() {
  const { backend } = useSettings.getState()
  return `http://${backend.host}:${backend.port}`
}

function headers() {
  const { backend } = useSettings.getState()
  return {
    'Content-Type': 'application/json',
    ...(backend.secret ? { Authorization: `Bearer ${backend.secret}` } : {}),
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(base() + path, {
    method,
    headers: headers(),
    body: body != null ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}
