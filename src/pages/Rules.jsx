import { useEffect, useState } from 'react'
import { useT } from '../hooks/useT'
import { fetchRules } from '../service'

export default function Rules() {
  const t = useT()
  const [rules, setRules] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    fetchRules().then(setRules)
  }, [])

  const kw = q.trim().toLowerCase()
  const filtered = rules.filter(
    (r) =>
      !kw ||
      r.type?.toLowerCase().includes(kw) ||
      (r.payload ?? '').toLowerCase().includes(kw) ||
      (r.proxy ?? '').toLowerCase().includes(kw),
  )

  return (
    <div>
      <div className="page-header">
        <div className="left">
          <input
            className="input"
            style={{ width: 220 }}
            placeholder={t('Search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="summary mono">
            {t('Rules')}: {rules.length}
          </span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 150 }}>{t('Type')}</th>
              <th>{t('Rule')}</th>
              <th style={{ width: 220 }}>{t('Proxy')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i}>
                <td>
                  <span className="chip">{r.type}</span>
                </td>
                <td className="mono">{r.payload}</td>
                <td>
                  <span className="chip accent">{r.proxy}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-tip">{t('No Rules')}</div>}
      </div>
    </div>
  )
}
