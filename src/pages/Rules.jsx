import { useEffect, useMemo, useState } from 'react'
import { useT } from '../hooks/useT'
import { fetchRules } from '../service'

// 原版 randomBGC(renderer.js @3122828): 同 proxy 名稳定同色(10~109 深色, 白字)
const colorCache = new Map()
function randomBGC(proxy) {
  if (colorCache.has(proxy)) return colorCache.get(proxy)
  const r = Math.floor(100 * Math.random() + 10)
  const g = Math.floor(100 * Math.random() + 10)
  const b = Math.floor(100 * Math.random() + 10)
  const style = { backgroundColor: `rgb(${r},${g},${b})` }
  colorCache.set(proxy, style)
  return style
}

export default function Rules() {
  const t = useT()
  const [rules, setRules] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    fetchRules().then(setRules)
  }, [])

  const kw = q.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!kw) return rules
    return rules.filter(
      (r) =>
        (r.type || '').toLowerCase().includes(kw) ||
        (r.payload || '').toLowerCase().includes(kw) ||
        (r.proxy || '').toLowerCase().includes(kw),
    )
  }, [rules, kw])

  return (
    <div id="main-rule-view">
      <div className="header">
        <div className="title">Top 100 matching rules({rules.length}).</div>
      </div>

      <div className="filter-view">
        <input
          type="text"
          placeholder="fiter by keywords"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="log-list">
        {filtered.map((r, i) => (
          <div key={i} className="log-item" title={r.payload}>
            <div className="left">
              <div className="url">{r.payload}</div>
              <div className="rule">{r.type}</div>
            </div>
            <div className="right-main">
              <div className="right" style={randomBGC(r.proxy)}>
                {r.proxy}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty-tip">{t('No Rules')}</div>}
      </div>
    </div>
  )
}
