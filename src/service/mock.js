// 演示模式的内置模拟数据,结构对齐 clash RESTful API / WebSocket 消息
const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const REGIONS = [
  { flag: '🇭🇰', name: '香港', count: 3, type: 'Shadowsocks' },
  { flag: '🇹🇼', name: '台湾', count: 2, type: 'Shadowsocks' },
  { flag: '🇯🇵', name: '日本', count: 2, type: 'Trojan' },
  { flag: '🇸🇬', name: '新加坡', count: 2, type: 'Vmess' },
  { flag: '🇺🇸', name: '美国', count: 2, type: 'Trojan' },
  { flag: '🇰🇷', name: '韩国', count: 1, type: 'Vmess' },
]

const regionNodes = []
for (const { flag, name, count, type } of REGIONS) {
  for (let i = 1; i <= count; i++) regionNodes.push({ name: `${flag} ${name} 0${i}`, type })
}

function fakeHistory(base) {
  const t = new Date().toISOString()
  return [{ time: t, delay: base ?? rand(60, 800) }]
}

function buildProxies() {
  const proxies = {}
  for (const { name, type } of regionNodes) {
    proxies[name] = {
      type,
      udp: true,
      xudp: false,
      tfo: false,
      history: fakeHistory(),
      name,
    }
  }
  proxies['DIRECT'] = { type: 'Direct', udp: true, history: [], name: 'DIRECT' }
  proxies['REJECT'] = { type: 'Reject', udp: false, history: [], name: 'REJECT' }
  proxies['COMPATIBLE'] = { type: 'Compatible', udp: false, history: [], name: 'COMPATIBLE' }

  const nodeNames = regionNodes.map((x) => x.name)
  const selectorNames = ['🚀 节点选择', '♻️ 自动选择', '🎯 全球直连', '🛑 广告拦截', '🐟 漏网之鱼']

  Object.assign(proxies, {
    '🚀 节点选择': {
      type: 'Selector',
      now: '🇭🇰 香港 01',
      all: [...nodeNames, '♻️ 自动选择', '🎯 全球直连'],
      history: [],
      name: '🚀 节点选择',
    },
    '♻️ 自动选择': {
      type: 'URLTest',
      now: '🇸🇬 新加坡 01',
      all: nodeNames,
      history: [],
      name: '♻️ 自动选择',
    },
    '🎯 全球直连': { type: 'Selector', now: 'DIRECT', all: ['DIRECT'], history: [], name: '🎯 全球直连' },
    '🛑 广告拦截': {
      type: 'Selector',
      now: 'REJECT',
      all: ['REJECT', 'DIRECT'],
      history: [],
      name: '🛑 广告拦截',
    },
    '🐟 漏网之鱼': {
      type: 'Selector',
      now: '🚀 节点选择',
      all: ['🚀 节点选择', '🎯 全球直连'],
      history: [],
      name: '🐟 漏网之鱼',
    },
  })

  proxies['GLOBAL'] = {
    type: 'Selector',
    now: '🚀 节点选择',
    all: [...selectorNames, ...nodeNames, 'DIRECT', 'REJECT'],
    history: [],
    name: 'GLOBAL',
  }

  return { proxies, groupNames: selectorNames }
}

const { proxies: MOCK_PROXIES, groupNames: MOCK_GROUP_NAMES } = buildProxies()

const MOCK_RULES = [
  ['DOMAIN-SUFFIX', 'google.com', '🚀 节点选择'],
  ['DOMAIN-SUFFIX', 'youtube.com', '🚀 节点选择'],
  ['DOMAIN-SUFFIX', 'github.com', '🚀 节点选择'],
  ['DOMAIN-SUFFIX', 'openai.com', '🚀 节点选择'],
  ['DOMAIN-KEYWORD', 'google', '🚀 节点选择'],
  ['DOMAIN-SUFFIX', 'cn', 'DIRECT'],
  ['DOMAIN-SUFFIX', 'baidu.com', 'DIRECT'],
  ['DOMAIN-SUFFIX', 'qq.com', 'DIRECT'],
  ['DOMAIN-SUFFIX', '163.com', 'DIRECT'],
  ['DOMAIN-KEYWORD', 'baidu', 'DIRECT'],
  ['DOMAIN-SUFFIX', 'ad.com', 'REJECT'],
  ['DOMAIN-KEYWORD', 'adservice', 'REJECT'],
  ['IP-CIDR', '127.0.0.0/8', 'DIRECT'],
  ['IP-CIDR', '192.168.0.0/16', 'DIRECT'],
  ['IP-CIDR6', '2620:0:2d0:200::7/128', 'DIRECT'],
  ['GEOIP', 'CN', 'DIRECT'],
  ['MATCH', '', '🐟 漏网之鱼'],
].map(([type, payload, proxy], i) => ({ type, payload, proxy, size: 10 + i }))

const LOG_HOSTS = [
  'www.google.com:443',
  'api.github.com:443',
  'fonts.gstatic.com:443',
  'mtalk.google.com:5228',
  'registry.npmjs.org:443',
  'www.youtube.com:443',
  'cdn.jsdelivr.net:443',
  'translate.googleapis.com:443',
  'update.code.visualstudio.com:443',
  'doh.pub:443',
  'www.bilibili.com:443',
]

const randomLogPayload = (type) => {
  const host = LOG_HOSTS[rand(0, LOG_HOSTS.length)]
  const net = Math.random() < 0.85 ? 'TCP' : 'UDP'
  const node = regionNodes[rand(0, regionNodes.length)].name
  const ip = `${rand(1, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 255)}:${rand(1, 65535)}`
  const r = Math.random()
  if (type === 'info') {
    if (r < 0.7) return `[${net}] 127.0.0.1:${rand(40000, 60000)} --> ${host} match DomainSuffix using 🚀 节点选择 [${node}] rAddr=${ip} host=${host}`
    return `[${net}] 127.0.0.1:${rand(40000, 60000)} --> ${host} match GeoIP(CN) using DIRECT rAddr=${ip} host=${host}`
  }
  if (type === 'debug') return `start initial dns record ${host} rAddr=${ip} type=A`
  if (type === 'warn') return `[UDP] dns resolve ${host} failed: timeout rAddr=${ip} host=${host}`
  return `[${net}] dial ${host} error: connection refused rAddr=${ip} host=${host}`
}

// 连接池:定时更新字节数、随机新增/断开,模拟 ws /connections 推送
const CONN_TEMPLATES = [
  { host: 'www.google.com', port: '443', type: 'HTTPS', rule: 'DomainSuffix', chains: ['🚀 节点选择', '🇭🇰 香港 01'] },
  { host: 'api.github.com', port: '443', type: 'HTTPS', rule: 'DomainSuffix', chains: ['🚀 节点选择', '🇯🇵 日本 01'] },
  { host: 'www.youtube.com', port: '443', type: 'HTTPS', rule: 'DomainSuffix', chains: ['🚀 节点选择', '🇸🇬 新加坡 02'] },
  { host: 'mtalk.google.com', port: '5228', type: 'HTTP Connect', rule: 'DomainKeyword', chains: ['🚀 节点选择', '🇺🇸 美国 01'] },
  { host: 'registry.npmjs.org', port: '443', type: 'TLS', rule: 'DomainSuffix', chains: ['♻️ 自动选择', '🇭🇰 香港 02'] },
  { host: 'cdn.jsdelivr.net', port: '443', type: 'HTTPS', rule: 'DomainSuffix', chains: ['♻️ 自动选择', '🇹🇼 台湾 01'] },
  { host: 'www.bilibili.com', port: '443', type: 'HTTPS', rule: 'GeoIP(CN)', chains: ['DIRECT'] },
  { host: 'doh.pub', port: '443', type: 'HTTPS', rule: 'GeoIP(CN)', chains: ['DIRECT'] },
  { host: 'cloudconfig.jetbrains.com', port: '443', type: 'HTTPS', rule: 'Match', chains: ['🐟 漏网之鱼', '🚀 节点选择', '🇰🇷 韩国 01'] },
]

function makeConnection(template) {
  const t = new Date()
  t.setSeconds(t.getSeconds() - rand(3, 600))
  const gid = () => Math.random().toString(36).slice(2, 10)
  return {
    id: `${gid()}-${gid()}-${gid()}`,
    metadata: {
      network: Math.random() < 0.85 ? 'tcp' : 'udp',
      type: template.type,
      sourceIP: '127.0.0.1',
      destinationIP: '',
      sourcePort: String(rand(40000, 60000)),
      destinationPort: template.port,
      host: template.host,
      processPath: '',
    },
    upload: rand(1e3, 8e4),
    download: rand(1e4, 2e6),
    start: t.toISOString(),
    speed: { upload: rand(1e3, 3e5), download: rand(1e4, 8e5) },
    chains: template.chains,
    rule: template.rule,
    rulePayload: template.rule === 'GeoIP(CN)' ? 'CN' : template.host,
  }
}

let conns = []

function seedConnections() {
  conns = []
  const picked = [...CONN_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, rand(6, 9))
  for (const tpl of picked) conns.push(makeConnection(tpl))
}

function tickConnections() {
  // 偶发断开旧的、加入新的
  if (conns.length > 5 && Math.random() < 0.12) conns.splice(rand(0, conns.length), 1)
  if (conns.length < 12 && Math.random() < 0.18) {
    conns.push(makeConnection(CONN_TEMPLATES[rand(0, CONN_TEMPLATES.length)]))
  }
  for (const c of conns) {
    c.upload += rand(0, 6e4)
    c.download += rand(1e3, 9e5)
    c.speed = { upload: rand(1e3, 3e5), download: rand(1e4, 8e5) }
  }
}

export const mock = {
  groupNames: MOCK_GROUP_NAMES,

  async getVersion() {
    await sleep(120)
    return { version: 'v1.19.2 (demo)', meta: true }
  },

  async getConfigs() {
    return {
      port: 0,
      'socks-port': 0,
      'mixed-port': 7890,
      'allow-lan': false,
      ipv6: false,
      mode: 'rule',
      'log-level': 'info',
    }
  },

  async getProxies() {
    await sleep(100)
    return { proxies: structuredClone(MOCK_PROXIES) }
  },

  async selectProxy(group, name) {
    const g = MOCK_PROXIES[group]
    if (g) g.now = name
    if (group === '🚀 节点选择' && MOCK_PROXIES.GLOBAL) MOCK_PROXIES.GLOBAL.now = name
  },

  async getDelay(name) {
    await sleep(rand(150, 1200))
    if (name === 'DIRECT') return { delay: rand(10, 50) }
    if (Math.random() < 0.12) {
      const err = new Error('An error occurred in the delay test: context deadline exceeded')
      throw err
    }
    return { delay: rand(50, 700) }
  },

  async getRules() {
    return { rules: structuredClone(MOCK_RULES) }
  },

  async closeConnection(id) {
    conns = conns.filter((c) => c.id !== id)
  },

  async closeAllConnections() {
    conns = []
  },

  async patchConfigs(data) {
    // 演示模式:仅回显成功
    return null
  },
}

// 模拟实时推送:traffic / logs / connections
export function startMockLive({ onTraffic, onConnections, onLog }) {
  let trafficUp = rand(2e4, 2e5)
  let trafficDown = rand(2e5, 2e6)
  let totalUp = 61807922
  let totalDown = 217168684

  seedConnections()

  const trafficTimer = setInterval(() => {
    trafficUp = Math.max(1e3, trafficUp * (0.4 + Math.random() * 1.5))
    trafficDown = Math.max(1e4, trafficDown * (0.5 + Math.random() * 1.4))
    if (Math.random() < 0.06) trafficDown = rand(3e6, 1.2e7)
    totalUp += trafficUp
    totalDown += trafficDown
    onTraffic({ up: Math.round(trafficUp), down: Math.round(trafficDown) })
  }, 1000)

  const connTimer = setInterval(() => {
    tickConnections()
    onConnections({
      downloadTotal: totalDown,
      uploadTotal: totalUp,
      connections: structuredClone(conns),
    })
  }, 1000)

  let logTimer
  const scheduleLog = () => {
    logTimer = setTimeout(() => {
      const r = Math.random()
      const type = r < 0.82 ? 'info' : r < 0.92 ? 'debug' : r < 0.97 ? 'warn' : 'error'
      onLog({ type, payload: randomLogPayload(type) })
      scheduleLog()
    }, rand(400, 2200))
  }
  scheduleLog()

  return () => {
    clearInterval(trafficTimer)
    clearInterval(connTimer)
    clearTimeout(logTimer)
  }
}
