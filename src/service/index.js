import * as realApi from '../api/clash'
import { createTrafficWS, createLogsWS, createConnectionsWS } from '../api/ws'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { mock, startMockLive } from './mock'

const isDemo = () => useSettings.getState().demoMode

const GROUP_TYPES = ['Selector', 'URLTest', 'Fallback', 'LoadBalance']

function applyProxies(data) {
  const { proxies } = data
  const groupNames = Object.values(proxies)
    .filter((p) => GROUP_TYPES.includes(p.type) && p.name !== 'GLOBAL')
    .map((p) => p.name)
  const delays = {}
  for (const p of Object.values(proxies)) {
    const h = p.history?.[p.history.length - 1]
    if (h?.delay) delays[p.name] = h.delay
  }
  useClash.getState().patch({ proxies, groupNames, delays })
}

// 启动时拉取版本 / 配置 / 代理,失败则标记未连接
export async function bootstrap() {
  try {
    const [version, configs, data] = isDemo()
      ? await Promise.all([mock.getVersion(), mock.getConfigs(), mock.getProxies()])
      : await Promise.all([realApi.getVersion(), realApi.getConfigs(), realApi.getProxies()])
    applyProxies(data)
    useClash.getState().patch({
      version: version.version,
      mode: configs.mode,
      connected: true,
    })
  } catch (err) {
    console.warn('[cfw] backend connect failed:', err?.message)
    useClash.getState().patch({ connected: false })
  }
}

export async function selectProxy(group, name) {
  const { proxies, patch } = useClash.getState()
  if (proxies[group]) {
    patch({ proxies: { ...proxies, [group]: { ...proxies[group], now: name } } })
  }
  try {
    if (isDemo()) await mock.selectProxy(group, name)
    else await realApi.selectProxy(group, name)
  } catch (err) {
    console.warn('[cfw] select proxy failed:', err?.message)
  }
}

export async function testDelay(name) {
  const { testUrl, testTimeout } = useSettings.getState()
  try {
    const res = isDemo()
      ? await mock.getDelay(name)
      : await realApi.getDelay(name, testUrl, testTimeout)
    const delay = res?.delay ?? 0
    useClash.setState((s) => ({ delays: { ...s.delays, [name]: delay } }))
  } catch {
    useClash.setState((s) => ({ delays: { ...s.delays, [name]: 0 } }))
  }
}

async function pMap(items, fn, concurrency) {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift())
  })
  await Promise.all(workers)
}

// 测试单个代理组的所有节点
export async function testGroupDelay(groupName) {
  const group = useClash.getState().proxies[groupName]
  if (!group?.all) return
  await pMap(group.all, testDelay, 6)
}

// 测试当前模式下可见的全部节点
export async function testAllDelay() {
  useClash.getState().patch({ testing: true })
  try {
    const { mode, groupNames, proxies } = useClash.getState()
    const groups = mode === 'global' ? ['GLOBAL'] : groupNames
    const names = [...new Set(groups.flatMap((g) => proxies[g]?.all ?? []))]
    await pMap(names, testDelay, 6)
  } finally {
    useClash.getState().patch({ testing: false })
  }
}

// 切换模式 / 同步 General 页的内核配置
export async function updateMode(mode) {
  useClash.getState().patch({ mode })
  if (!isDemo()) {
    try {
      await realApi.patchConfigs({ mode })
    } catch (err) {
      console.warn('[cfw] update mode failed:', err?.message)
    }
  }
}

export async function syncConfigs(obj) {
  if (isDemo()) return
  try {
    await realApi.patchConfigs(obj)
  } catch (err) {
    console.warn('[cfw] patch configs failed:', err?.message)
  }
}

export async function updateLogLevel(level) {
  useSettings.getState().patch({ logLevel: level })
  if (!isDemo()) {
    try {
      await realApi.patchConfigs({ 'log-level': level })
    } catch (err) {
      console.warn('[cfw] update log level failed:', err?.message)
    }
  }
  restartLogs()
}

export async function updateGeo() {
  if (isDemo()) return
  await realApi.updateGeo()
}

export async function fetchRules() {
  try {
    const data = isDemo() ? await mock.getRules() : await realApi.getRules()
    return data.rules ?? []
  } catch {
    return []
  }
}

// ---- 实时数据(traffic / logs / connections)----

let liveStops = []
let logStop = null

// 上一次快照,用于计算每条连接的实时速率
let lastConnSnap = new Map()

function handleConnections(data) {
  const now = Date.now()
  const rows = (data.connections ?? []).map((c) => {
    const prev = lastConnSnap.get(c.id)
    const dt = prev ? Math.max(0.2, (now - prev.ts) / 1000) : 1
    return {
      ...c,
      upSpeed: prev ? Math.max(0, (c.upload - prev.upload) / dt) : 0,
      downSpeed: prev ? Math.max(0, (c.download - prev.download) / dt) : 0,
    }
  })
  lastConnSnap = new Map(
    rows.map((r) => [r.id, { upload: r.upload, download: r.download, ts: now }]),
  )
  useClash.setState({
    connections: rows,
    totals: { up: data.uploadTotal ?? 0, down: data.downloadTotal ?? 0 },
  })
}

function openLogWS() {
  const ws = createLogsWS(useSettings.getState().logLevel)
  ws.onmessage = (e) => {
    try {
      const { type, payload } = JSON.parse(e.data)
      useClash.getState().pushLog({ type, payload, ts: Date.now() })
    } catch {
      /* ignore malformed frame */
    }
  }
  return () => ws.close()
}

export function startLive() {
  stopLive()
  if (isDemo()) {
    liveStops.push(
      startMockLive({
        onTraffic: ({ up, down }) => useClash.setState({ traffic: { up, down } }),
        onConnections: handleConnections,
        onLog: (entry) => useClash.getState().pushLog({ ...entry, ts: Date.now() }),
      }),
    )
  } else {
    const trafficWs = createTrafficWS()
    trafficWs.onmessage = (e) => {
      try {
        const { up, down } = JSON.parse(e.data)
        useClash.setState({ traffic: { up, down } })
      } catch {
        /* ignore */
      }
    }
    const connWs = createConnectionsWS()
    connWs.onmessage = (e) => {
      try {
        handleConnections(JSON.parse(e.data))
      } catch {
        /* ignore */
      }
    }
    connWs.onclose = () => useClash.getState().patch({ connected: false })
    logStop = openLogWS()
    liveStops.push(
      () => trafficWs.close(),
      () => connWs.close(),
      () => logStop?.(),
    )
  }
}

export function stopLive() {
  for (const stop of liveStops) {
    try {
      stop()
    } catch {
      /* ignore */
    }
  }
  liveStops = []
  logStop = null
}

// 日志级别变化后重建 logs websocket
export function restartLogs() {
  if (isDemo()) return
  logStop?.()
  logStop = openLogWS()
}

export async function closeConnection(id) {
  useClash.setState((s) => ({ connections: s.connections.filter((c) => c.id !== id) }))
  try {
    if (isDemo()) await mock.closeConnection(id)
    else await realApi.closeConnection(id)
  } catch (err) {
    console.warn('[cfw] close connection failed:', err?.message)
  }
}

export async function closeAllConnections() {
  useClash.setState({ connections: [] })
  try {
    if (isDemo()) await mock.closeAllConnections()
    else await realApi.closeAllConnections()
  } catch (err) {
    console.warn('[cfw] close all connections failed:', err?.message)
  }
}

// ---- 订阅管理(浏览器端无法写内核配置文件,订阅信息保存在本地)----

const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min
const GB = 1 << 30

export function importProfile(url) {
  return new Promise((resolve, reject) => {
    let host
    try {
      host = new URL(url).host
    } catch {
      reject(new Error('无效的订阅链接'))
      return
    }
    // 模拟下载耗时
    setTimeout(() => {
      const name = host.replace(/^www\./, '').split('.')[0] || 'profile'
      const profile = {
        id: crypto.randomUUID(),
        name,
        url,
        used: rand(1, 80) * (1 << 20) * 10,
        total: rand(10, 200) * GB,
        updatedAt: Date.now(),
      }
      useSettings.getState().addProfile(profile)
      useSettings.getState().setActiveProfile(profile.id)
      resolve(profile)
    }, 900)
  })
}

export function updateProfileById(id) {
  // 模拟更新订阅
  return new Promise((resolve) => {
    setTimeout(() => {
      useSettings.getState().updateProfile(id, {
        updatedAt: Date.now(),
        used: rand(1, 80) * (1 << 20) * 10,
      })
      resolve()
    }, 700)
  })
}
