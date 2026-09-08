import { useEffect, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useSettings } from '../store/settings'
import { useT } from '../hooks/useT'
import { updateLogLevel } from '../service'
import { fmtTime } from '../utils/format'

const LEVELS = ['debug', 'info', 'warning', 'error', 'silent']

export default function Logs() {
  const t = useT()
  const logs = useClash((s) => s.logs)
  const clearLogs = useClash((s) => s.clearLogs)
  const logLevel = useSettings((s) => s.logLevel)
  const [paused, setPaused] = useState(false)

  const viewRef = useRef(null)
  const followRef = useRef(true)

  const onScroll = () => {
    const el = viewRef.current
    if (!el) return
    followRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }

  useEffect(() => {
    const el = viewRef.current
    if (!paused && followRef.current && el) {
      el.scrollTop = el.scrollHeight
    }
  }, [logs, paused])

  return (
    <div>
      <div className="page-header">
        <div className="left">
          <select
            className="select"
            value={logLevel}
            onChange={(e) => updateLogLevel(e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div className="right">
          <button
            type="button"
            className="icon-btn"
            title={paused ? t('Resume') : t('Pause')}
            onClick={() => setPaused(!paused)}
          >
            <span className="material-icons">{paused ? 'play_arrow' : 'pause'}</span>
          </button>
          <button type="button" className="icon-btn" title={t('Clear')} onClick={clearLogs}>
            <span className="material-icons">delete</span>
          </button>
        </div>
      </div>

      <div className="log-view" ref={viewRef} onScroll={onScroll}>
        {logs.map((e, i) => (
          <div className="log-line" key={i}>
            <span className="log-time">{fmtTime(e.ts)}</span>
            <span className={`log-type ${e.type}`}>{e.type}</span>
            <span className="log-payload">{e.payload}</span>
          </div>
        ))}
        {logs.length === 0 && <div className="empty-tip">{t('No Logs')}</div>}
      </div>
    </div>
  )
}
