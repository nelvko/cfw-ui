import { useEffect, useMemo, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useSettings } from '../store/settings'
import { useT } from '../hooks/useT'
import { fmtTime } from '../utils/format'
import SelectView from '../components/SelectView'

// 与原版 logTypeEmoji 一致
const EMOJI = { info: '✅', debug: '🪲', warn: '‼️', error: '❌' }

// 与原版 parseStringLog 一致:拆分 msg + key=value 字段
function parseLog(entry) {
  const { payload = '', type, ts } = entry
  let msg = ''
  if (/^([^=]+)( .+=|$)/.test(payload)) msg = RegExp.$1.trim()
  const fields = []
  const re = /([^\s]+?)=([^=]+?)(?= [^\s]+=|$)/g
  let m
  while ((m = re.exec(payload))) {
    const key = m[1].trim()
    if (key === 'mode') continue
    fields.push({ key, value: m[2].trim().replace(/^"|"$/g, '') })
  }
  return { id: `${ts}-${Math.random().toString(36).slice(2, 7)}`, msg, type, fields, time: fmtTime(ts) }
}

export default function Logs() {
  const t = useT()
  const logs = useClash((s) => s.logs)
  const clearLogs = useClash((s) => s.clearLogs)
  const mode = useClash((s) => s.mode)
  const theme = useSettings((s) => s.theme)
  const [paused, setPaused] = useState(false)
  const [q, setQ] = useState('')
  const [logStyle, setLogStyle] = useState(0)
  const [logLevel, setLogLevel] = useState(0)

  const viewRef = useRef(null)
  const followRef = useRef(true)

  const onScroll = () => {
    const el = viewRef.current
    if (!el) return
    followRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }

  useEffect(() => {
    const el = viewRef.current
    if (!paused && followRef.current && el) el.scrollTop = el.scrollHeight
  }, [logs, paused])

  const parsed = useMemo(() => logs.map(parseLog), [logs])

  const kw = q.trim().toLowerCase()
  const filtered = parsed
    .filter((e) => (logLevel === 1 ? true : e.type !== 'debug'))
    .filter(
      (e) =>
        !kw ||
        e.msg.toLowerCase().includes(kw) ||
        e.fields.some((f) => `${f.key}=${f.value}`.toLowerCase().includes(kw)),
    )
    .slice(-200)

  // 原版:dark/2077 主题 debug 用黄色,否则用暗黄
  const darkTheme = ['dark', '2077'].includes(theme)
  const typeCls = (type) => (type === 'debug' ? (darkTheme ? 'debug' : 'debugdark') : type)

  const addrOf = (e) => e.fields.find((f) => f.key === 'rAddr')?.value || ''
  const showDetails = logStyle === 1 || q !== ''

  return (
    <div className="main-log-view">
      <div className="title">
        <div className="text">
          <div>Request Logs</div>
          <div className="hint">mode: {mode}</div>
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
        <div className="btns">
          <div className="selects">
            <SelectView items={['Simple', 'Detailed']} value={logStyle} onChange={setLogStyle} />
            <SelectView items={['info', 'debug']} value={logLevel} onChange={setLogLevel} />
          </div>
          <div className="button button-clear" onClick={clearLogs}>
            Clear
          </div>
          <div className={`button ${paused ? 'button-on' : 'button-off'}`} onClick={() => setPaused(!paused)}>
            {paused ? 'Start' : 'Stop'}
          </div>
        </div>
      </div>

      <div className="log-list" ref={viewRef} onScroll={onScroll}>
        {filtered.length === 0 && (
          <div className="empty-list">
            <div>Empty log list</div>
            <div>Refresh your browser to make requests.</div>
          </div>
        )}
        {filtered.map((e) => {
          const addr = addrOf(e)
          const fields = showDetails ? e.fields.filter((f) => f.key !== 'rAddr') : []
          return (
            <div key={e.id} className="log-item">
              <div className="log-item-body">
                <div className="log-row">
                  <div className={`log-msg ${typeCls(e.type)}`}>
                    {EMOJI[e.type]} {e.msg}
                  </div>
                  <div className="log-time">{e.time}</div>
                </div>
                {addr && (
                  <div className="log-addr">
                    <span className="addr-arrow">▲</span>
                    {addr}
                  </div>
                )}
                {fields.length > 0 && (
                  <div className="log-fields">
                    {fields.map((f) => (
                      <div key={f.key} className="log-field">
                        <span className="log-field-key">{f.key}</span>
                        <span>{f.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
