import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const HINT_DELAY = 1000
const GAP = 5

// 对应原版 HintView(renderer.js module 13338, scoped data-v-6e240a95):
// 根元素 = div.main-hint-view + flex/flex-col/justify-center/items-center(18x18, position:relative)。
// 传入的 class 与事件(如 onClick)都落在根元素上(对应 Vue 属性透传 + v-on $listeners),
// 子节点原样渲染。悬停 1000ms 后在指定方位弹出提示气泡。
export default function Hint({ hint, position = 'top', className, children, ...rest }) {
  const rootRef = useRef(null)
  const textRef = useRef(null)
  const timerRef = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  useLayoutEffect(() => {
    const el = textRef.current
    const root = rootRef.current
    if (!show || !el || !root) return
    const rect = root.getBoundingClientRect()
    const tip = el.getBoundingClientRect()
    if (position === 'bottom') {
      el.style.top = rect.y + rect.height + GAP + 'px'
      el.style.left = rect.x - tip.width / 2 + rect.width / 2 + 'px'
    } else if (position === 'left') {
      el.style.top = rect.y - tip.height / 2 + rect.height / 2 + 'px'
      el.style.left = rect.x - tip.width - GAP + 'px'
    } else if (position === 'right') {
      el.style.top = rect.y - tip.height / 2 + rect.height / 2 + 'px'
      el.style.left = rect.x + rect.width + GAP + 'px'
    } else {
      el.style.top = rect.y - tip.height - GAP + 'px'
      el.style.left = rect.x - tip.width / 2 + rect.width / 2 + 'px'
    }
  }, [show, position])

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShow(true), HINT_DELAY)
  }

  const stop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setShow(false)
  }

  return (
    <div
      ref={rootRef}
      className={className ? 'main-hint-view ' + className : 'main-hint-view'}
      onMouseEnter={start}
      onMouseLeave={stop}
      {...rest}
    >
      {show && (
        <span ref={textRef} className='cfw-hint'>
          {hint}
        </span>
      )}
      {children}
    </div>
  )
}
