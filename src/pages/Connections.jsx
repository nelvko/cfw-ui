import { useMemo, useState } from 'react'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import { closeAllConnections, closeConnection } from '../service'

// 原版 6 个排序标签(hint 文案与图标对)
const LABELS = [
  { key: 'upSpeed', hint: 'Upload Speed', icons: ['upload', 'speed'] },
  { key: 'downSpeed', hint: 'Download Speed', icons: ['download', 'speed'] },
  { key: 'upload', hint: 'Upload Traffic', icons: ['upload', 'signal_cellular_alt'] },
  { key: 'download', hint: 'Download Traffic', icons: ['download', 'signal_cellular_alt'] },
  { key: 'start', hint: 'Start Time', icons: ['schedule'] },
  { key: 'dest', hint: 'Destination', icons: ['computer'] },
]

// 与原版 traffic() 一致:1/2 位小数的字节格式化
function traffic(bytes, digits = 2) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let n = 0
  let v = Number(bytes) || 0
  while (v >= 1024 && n < units.length - 1) {
    v /= 1024
    n++
  }
  return `${n === 0 ? v : v.toFixed(digits)} ${units[n]}`
}

function calcSpeedText(c) {
  const sp = c.speed
  if (!sp) return ''
  const parts = []
  if (sp.upload) parts.push(`↑${traffic(sp.upload)}/s`)
  if (sp.download) parts.push(`↓${traffic(sp.download)}/s`)
  return parts.join(' ')
}

function fromNow(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'a few seconds ago'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} minutes ago`
  const h = Math.floor(m / 60)
  return `${h} hours ago`
}

const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default function Connections() {
  const t = useT()
  const connections = useClash((s) => s.connections)
  const totals = useClash((s) => s.totals)
  const [q, setQ] = useState('')
  const [label, setLabel] = useState(null)
  const [reverse, setReverse] = useState(false)
  const [paused, setPaused] = useState(false)

  const kw = q.trim().toLowerCase()
  const filtered = connections.filter(
    (c) =>
      !kw ||
      (c.metadata.host || '').toLowerCase().includes(kw) ||
      (c.chains || []).join(' ').toLowerCase().includes(kw) ||
      (c.rule || '').toLowerCase().includes(kw),
  )

  const ordered = useMemo(() => {
    if (label == null) return filtered
    const get = {
      upSpeed: (c) => c.speed?.upload ?? 0,
      downSpeed: (c) => c.speed?.download ?? 0,
      upload: (c) => c.upload ?? 0,
      download: (c) => c.download ?? 0,
      start: (c) => new Date(c.start).getTime(),
      dest: (c) => c.metadata.host || '',
    }[label]
    const arr = [...filtered].sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      return typeof va === 'string' ? va.localeCompare(vb) : va - vb
    })
    if (reverse) arr.reverse()
    return arr
  }, [filtered, label, reverse])

  const selectLabel = (key) => {
    if (label === key) setReverse(!reverse)
    else {
      setLabel(key)
      setReverse(false)
    }
  }

  // 原版默认 connChainType=0(Proxy):仅显示端点 chains[0]
  const endpointOf = (c) => {
    const ch = c.chains || []
    return ch.length >= 1 ? ch[0] : ''
  }

  return (
    <div className="main-connection-view">
      <div className="header">
        <div className="title">
          <div>{t('Connections')}</div>
        </div>
        <div className="search-area">
          <input
            className="search-box"
            type="text"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {q && (
            <span className="material-icons search-close" onClick={() => setQ('')}>
              close
            </span>
          )}
        </div>
        <div className="header-right">
          <div className="total-hint">
            Total: ↑{traffic(totals.up, 1)} ↓{traffic(totals.down, 1)}
          </div>
        </div>
      </div>

      <div className="control-view">
        <div className="labels">
          {LABELS.map((l) => (
            <div
              key={l.key}
              className={`label${label === l.key ? (reverse ? ' label-selected-reverse' : ' label-selected') : ''}`}
              title={l.hint}
              onClick={() => selectLabel(l.key)}
            >
              <div className="label-icons">
                {l.icons.map((ic) => (
                  <span key={ic} className="material-icons">
                    {ic}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="flex-grow" />
          <div
            className={`close-all-btn ${paused ? 'button-resume' : 'button-pause'}`}
            onClick={() => setPaused(!paused)}
          >
            {paused ? 'Resume' : 'Pause'}
          </div>
          <div className="close-all-btn" onClick={closeAllConnections}>
            Close All ({ordered.length})
          </div>
        </div>
      </div>

      <div className="scroll-view">
        {ordered.map((c) => (
          <div key={c.id} className={`conn-item${c.closed ? ' conn-item-closed' : ''}`}>
            <div>
              <div className="conn-item-top">
                <div className="conn-host">
                  {c.metadata.host || c.metadata.destinationIP}:{c.metadata.destinationPort}
                </div>
              </div>
              <div className="conn-labels">
                <div className="conn1">{c.metadata.network.toUpperCase()}</div>
                <div className="conn2">{c.metadata.type}</div>
                {endpointOf(c) && <div className="conn4">{endpointOf(c)}</div>}
                <div className="conn5">{upperFirst(fromNow(c.start))}</div>
                {calcSpeedText(c) && <div className="conn6">{calcSpeedText(c)}</div>}
              </div>
            </div>
            {!c.closed && !paused && (
              <div className="close-btn" onClick={() => closeConnection(c.id)}>
                <span className="material-icons">block</span>
              </div>
            )}
          </div>
        ))}
        {ordered.length === 0 && <div className="empty-tip">{t('No Connections')}</div>}
      </div>
    </div>
  )
}
