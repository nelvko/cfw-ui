import { useState } from 'react'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import { closeAllConnections, closeConnection } from '../service'
import { fmtBytes, fmtDuration, fmtSpeed } from '../utils/format'

export default function Connections() {
  const t = useT()
  const connections = useClash((s) => s.connections)
  const totals = useClash((s) => s.totals)
  const traffic = useClash((s) => s.traffic)
  const [q, setQ] = useState('')

  const kw = q.trim().toLowerCase()
  const filtered = connections.filter(
    (c) =>
      !kw ||
      c.metadata.host?.toLowerCase().includes(kw) ||
      c.rule?.toLowerCase().includes(kw) ||
      c.chains?.join(' ').toLowerCase().includes(kw),
  )

  const onClose = (id) => closeConnection(id)

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
          <div className="summary mono">
            <span>
              <b className="speed-in">↓ {fmtSpeed(traffic.down)}</b>
            </span>
            <span>
              <b className="speed-out">↑ {fmtSpeed(traffic.up)}</b>
            </span>
            <span>
              {t('Total')}: <b>↓ {fmtBytes(totals.down)}</b>
            </span>
            <span>
              <b>↑ {fmtBytes(totals.up)}</b>
            </span>
          </div>
        </div>
        <div className="right">
          <button type="button" className="btn danger" onClick={closeAllConnections}>
            {t('Close All')}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{t('Host')}</th>
              <th style={{ width: 180 }}>{t('Chains')}</th>
              <th style={{ width: 170 }}>{t('Rule')}</th>
              <th style={{ width: 100 }}>{t('Upload')}</th>
              <th style={{ width: 100 }}>{t('Download ')}</th>
              <th style={{ width: 90 }}>↑ {t('Total')}</th>
              <th style={{ width: 90 }}>↓ {t('Total')}</th>
              <th style={{ width: 80 }}>{t('Time')}</th>
              <th style={{ width: 50 }}>{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="ell">{c.metadata.host || c.metadata.destinationIP}</div>
                  <div className="hint mono">
                    {c.metadata.network} · {c.metadata.type}
                  </div>
                </td>
                <td>
                  <span className="chip" title={(c.chains ?? []).join(' → ')}>
                    {[...(c.chains ?? [])].reverse().join(' → ')}
                  </span>
                </td>
                <td>
                  <span className="chip accent" title={`${c.rule ?? ''} ${c.rulePayload ?? ''}`}>
                    {c.rule}
                    {c.rulePayload ? `(${c.rulePayload})` : ''}
                  </span>
                </td>
                <td className="mono speed-out">{fmtSpeed(c.upSpeed)}</td>
                <td className="mono speed-in">{fmtSpeed(c.downSpeed)}</td>
                <td className="mono">{fmtBytes(c.upload)}</td>
                <td className="mono">{fmtBytes(c.download)}</td>
                <td className="mono">{fmtDuration(c.start)}</td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    title={t('Disconnect')}
                    onClick={() => onClose(c.id)}
                  >
                    <span className="material-icons">link_off</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-tip">{t('No Connections')}</div>}
      </div>
    </div>
  )
}
