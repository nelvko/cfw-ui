import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const INFO_DELAY = 500
const OFFSET = 20
const HIDDEN = { top: '-1000px', left: '-1000px' }

// 对应原版 info-icon 组件(renderer.js scoped data-v-d4bbbea2):
// 悬停 500ms 后在图标右侧 20px 处弹出主题色说明面板;
// 面板下方空间不足时改为向上对齐。
export default function InfoIcon({ children }) {
  const iconRef = useRef(null)
  const contentRef = useRef(null)
  const timerRef = useRef(null)
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState(HIDDEN)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  useLayoutEffect(() => {
    if (!show) {
      setPos(HIDDEN)
      return
    }
    const icon = iconRef.current.getBoundingClientRect()
    const height = contentRef.current.offsetHeight
    setPos(
      icon.y + OFFSET + height < window.innerHeight
        ? { top: `${icon.y}px`, left: `${icon.x + OFFSET}px` }
        : { top: `${icon.y + OFFSET - height}px`, left: `${icon.x + OFFSET}px` },
    )
  }, [show])

  const enter = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShow(true), INFO_DELAY)
  }

  const leave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setShow(false)
  }

  return (
    <div className="info-icon-main" onMouseEnter={enter} onMouseLeave={leave}>
      <div ref={contentRef} className="content" style={pos}>
        {children}
      </div>
      <span ref={iconRef} className="material-icons info-icon-text">
        info
      </span>
    </div>
  )
}
