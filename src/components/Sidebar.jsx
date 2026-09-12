import { useEffect, useRef, useState } from 'react'
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
const DEFAULT_ORDER = MENU.map(([id]) => id)
const TITLE = Object.fromEntries(MENU)

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
  const menuOrder = useSettings((s) => s.menuOrder)
  const connected = useClash((s) => s.connected)
  const traffic = useClash((s) => s.traffic)
  const runningTime = useRunningTime()

  // 原版 tabs = menuItemsWithOrder(持久化); 空则用默认顺序
  const [order, setOrder] = useState(() => (menuOrder?.length ? menuOrder : DEFAULT_ORDER))
  const [sorting, setSorting] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [menu, setMenu] = useState(null)
  const dragIdx = useRef(null)
  const menuRef = useRef(null)
  const shortcutTimer = useRef(null)

  const activeIdx = order.indexOf(activePage)
  const up = fmtSpeedParts(traffic.up)
  const down = fmtSpeedParts(traffic.down)

  // 原版: 快捷键触发后显示 5s 再隐藏序号
  const revealShortcuts = () => {
    setShowShortcuts(true)
    if (shortcutTimer.current) clearTimeout(shortcutTimer.current)
    shortcutTimer.current = setTimeout(() => setShowShortcuts(false), 5000)
  }

  // 数字键 1~8 切换页面并短暂显示序号
  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement) return
      const n = Number(e.key)
      if (n >= 1 && n <= order.length) {
        revealShortcuts()
        setActivePage(order[n - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (shortcutTimer.current) clearTimeout(shortcutTimer.current)
    }
  }, [order, setActivePage])

  useEffect(() => {
    if (!menu) return
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [menu])

  // 原版 vuedraggable: 排序态下可拖拽重排, 结束后持久化
  const onDragStart = (i) => (e) => {
    dragIdx.current = i
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragEnter = (i) => () => {
    const from = dragIdx.current
    if (from == null || from === i) return
    const next = [...order]
    const [moved] = next.splice(from, 1)
    next.splice(i, 0, moved)
    dragIdx.current = i
    setOrder(next)
  }
  const onDragEnd = () => {
    dragIdx.current = null
    useSettings.getState().patch({ menuOrder: order })
  }

  const stopSorting = () => {
    setSorting(false)
    useSettings.getState().patch({ menuOrder: order })
  }

  const isActive = (id) => id === activePage

  return (
    <aside className="sidebar" onContextMenu={(e) => e.preventDefault()}>
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

      <ul
        className="menu"
        onContextMenu={(e) => {
          e.preventDefault()
          setMenu({ x: e.clientX, y: e.clientY })
        }}
      >
        {order.map((id, idx) => {
          const cls = []
          if (sorting) cls.push(`shaking${(idx % 3) + 1}`)
          if (isActive(id)) cls.push('active')
          else cls.push('inactive')
          if (idx === activeIdx - 1) cls.push('above-active')
          if (idx === activeIdx + 1) cls.push('below-active')
          if (dragIdx.current === idx) cls.push('drag-item')
          return (
            <li
              key={id}
              className={`menu-item ${cls.join(' ')}`}
              draggable={sorting}
              onDragStart={onDragStart(idx)}
              onDragEnter={onDragEnter(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={onDragEnd}
              onClick={() => !sorting && setActivePage(id)}
            >
              <div className="inner">
                <span className={`num${showShortcuts ? ' show' : ''}`}>{idx + 1}</span>
                <span>{t(TITLE[id])}</span>
              </div>
            </li>
          )
        })}
      </ul>

      {sorting && (
        <div className="stop-btn" onClick={stopSorting}>
          Stop Sorting
        </div>
      )}

      <div className="running-time">
        <div className="timer-text">{runningTime}</div>
      </div>

      <div className="clash-status">
        <span
          className={`clash-status-icon ${connected ? 'clash-running' : 'clash-stopped'}`}
        />
        <span className="clash-status-hint">{connected ? t('Connected') : t('Disconnected')}</span>
      </div>

      {menu && (
        <div ref={menuRef} className="ctx-menu" style={{ left: menu.x, top: menu.y }}>
          <div className="ctx-item" onClick={() => { setMenu(null); setSorting(true) }}>
            <span className="material-icons">reorder</span>
            <span>Reorder</span>
          </div>
        </div>
      )}
    </aside>
  )
}
