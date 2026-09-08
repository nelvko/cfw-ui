import { useEffect, useState } from 'react'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import { fmtSpeedParts } from '../utils/format'

const MENU = [
  ['general', 'General'],
  ['proxies', 'Proxies'],
  ['profiles', 'Profiles'],
  ['logs', 'Logs'],
  ['connections', 'Connections'],
  ['rules', 'Rules'],
  ['settings', 'Settings'],
  ['feedback', 'Feedback'],
]

// CFW 默认 runTimeFormat: "hh : mm : ss"
const APP_START = Date.now()
const p2 = (n) => String(n).padStart(2, '0')

function useRunningTime() {
  const [text, setText] = useState('00 : 00 : 00')
  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - APP_START) / 1000)
      setText(
        `${p2(Math.floor(s / 3600))} : ${p2(Math.floor((s % 3600) / 60))} : ${p2(s % 60)}`,
      )
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return text
}

export default function Sidebar() {
  const t = useT()
  const activePage = useSettings((s) => s.activePage)
  const setActivePage = useSettings((s) => s.setActivePage)
  const connected = useClash((s) => s.connected)
  const traffic = useClash((s) => s.traffic)
  const runningTime = useRunningTime()
  const activeIdx = MENU.findIndex(([id]) => id === activePage)
  const up = fmtSpeedParts(traffic.up)
  const down = fmtSpeedParts(traffic.down)

  return (
    <aside className="sidebar">
      <div className="traffic-view">
        <div className="traffic-row">
          <div className="traffic-row-inner">
            <span className="bold-icon">↑</span>
            <span>{up.num}</span>
            <span className="bold-icon">{up.unit}</span>
          </div>
        </div>
        <div className="traffic-row">
          <div className="traffic-row-inner">
            <span className="bold-icon">↓</span>
            <span>{down.num}</span>
            <span className="bold-icon">{down.unit}</span>
          </div>
        </div>
      </div>

      <ul className="menu">
        {MENU.map(([id, key], idx) => {
          const cls = [idx === activeIdx ? 'active' : 'inactive']
          if (idx === activeIdx + 1) cls.push('below-active')
          if (idx === activeIdx - 1) cls.push('above-active')
          return (
            <li
              key={id}
              className={`menu-item ${cls.join(' ')}`}
              onClick={() => setActivePage(id)}
            >
              <div className="inner">{t(key)}</div>
            </li>
          )
        })}
      </ul>

      <div className="running-time">
        <div className="timer-text">{runningTime}</div>
      </div>

      <div className="clash-status">
        <span className={`clash-status-icon${connected ? ' on' : ''}`} />
        <span className="clash-status-hint">{connected ? t('Connected') : t('Disconnected')}</span>
      </div>
    </aside>
  )
}
