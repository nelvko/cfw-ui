import { useEffect, useMemo, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useSettings } from '../store/settings'
import { useT } from '../hooks/useT'
import { fmtTime } from '../utils/format'
import SelectView from '../components/SelectView'

// 与原版 logTypeEmoji 一致
const EMOJI = { info: '✅', debug: '🪲', warn: '‼️', error: '❌' }

// 与原版 parseStringLog 一致:提取 msg(首个 key=value 之前的文本) + key=value 字段
function parseLog(entry) {
  const { payload = '', type, ts, id } = entry
  const re = /([^\s]+?)=([^=]+?)(?=\s+[^\s]+?=|$)/g
  const fields = []
  let firstIndex = -1
  let m
  while ((m = re.exec(payload))) {
    if (firstIndex < 0) firstIndex = m.index
    fields.push({ key: m[1].trim(), value: m[2].trim().replace(/^"|"$/g, '') })
  }
  const msg = (firstIndex >= 0 ? payload.slice(0, firstIndex) : payload).trim()
  return { id: id ?? `${ts}`, msg, type, fields, time: fmtTime(ts) }
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
  // 原版 showDetailItemIDs:点击行手动展开/折叠的日志 id
  const [detailIds, setDetailIds] = useState([])
  const [menu, setMenu] = useState(null)

  const viewRef = useRef(null)
  const menuRef = useRef(null)
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

  useEffect(() => {
    if (!menu) return
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menu])

  const parsed = useMemo(() => logs.map(parseLog), [logs])

  const searchReg = useMemo(() => {
    if (!q) return null
    try {
      return new RegExp(q, 'i')
    } catch {
      return null
    }
  }, [q])

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
  // 原版 isShowDetails: Detailed 样式 / 搜索中 / 手动展开
  const showDetails = (e) => logStyle === 1 || q !== '' || detailIds.includes(e.id)

  const toggleDetail = (id) => {
    setDetailIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  // 原版 handleItemRightClick: 关闭自动滚动 + 弹出复制 rAddr 菜单
  const onRightClick = (ev, e) => {
    ev.preventDefault()
    followRef.current = false
    setMenu({ x: ev.clientX, y: ev.clientY, addr: addrOf(e) })
  }

  const copyAddr = (addr) => {
    try {
      navigator.clipboard?.writeText(addr)
    } catch {
      /* ignore */
    }
    setMenu(null)
  }

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
            title={searchReg ? String(searchReg) : ''}
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
          const details = showDetails(e)
          const fields = details ? e.fields.filter((f) => f.key !== 'rAddr') : []
          return (
            <div
              key={e.id}
              className="log-item"
              onClick={() => toggleDetail(e.id)}
              onContextMenu={(ev) => onRightClick(ev, e)}
            >
              <div className="log-item-body">
                <div className="log-row">
                  <div className={`log-msg ${typeCls(e.type)}`}>
                    {EMOJI[e.type]} {e.msg}
                  </div>
                  <div className="log-time">{e.time}</div>
                </div>
                {addr && (
                  <div className="log-addr">
                    <span className={`addr-arrow${details ? ' open' : ''}`}>▲</span>
                    {addr}
                  </div>
                )}
                {fields.length > 0 && (
                  <div className="log-fields">
                    {fields.map((f) => (
                      <div key={f.key} className="log-field">
                        <div className="log-field-key">{f.key === 'lAddr' ? 'FROM' : f.key.toUpperCase()}</div>
                        <span>⇢</span>
                        <div className="log-field-val">{f.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {menu && (
        <div ref={menuRef} className="ctx-menu" style={{ left: menu.x, top: menu.y }}>
          <div className="ctx-item ctx-item-disabled">{menu.addr || 'Unknown'}</div>
          <div className="ctx-item" onClick={() => copyAddr(menu.addr)}>
            <span className="material-icons">content_copy</span>
            <span>Copy</span>
          </div>
        </div>
      )}
    </div>
  )
}
