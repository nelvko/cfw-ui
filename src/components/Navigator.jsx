import { useEffect, useRef, useState } from 'react'

// 原版 $removeEmoji(renderer.js @3405664): 去 emoji 后取 trim()[0] 为收起态缩写
function removeEmoji(s) {
  return s.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
}

// 原版 Navigator 组件(renderer.js @3215694, scoped 298f5540):
// props list/index/width/errorIndexes; 收起态宽 20px 半透明显示缩写首字符,
// hover 任一 item 时向左展开(width px + translateX(-10px) 抽屉), 离开恢复。
export default function Navigator({ list = [], index = -1, width = '100', errorIndexes = [], onSelect }) {
  const [hover, setHover] = useState(-1)
  const listRef = useRef(null)

  const isClosed = hover === -1
  const style = isClosed
    ? { opacity: 0.5, alignItems: 'center', width: '20px', backgroundColor: 'transparent' }
    : { opacity: 1, width: `${width}px`, right: '-10px', transform: 'translateX(-10px)', borderLeftWidth: '1px' }

  // 原版 watch index(debounce 500ms): 收起态时滚动列表使选中项可见
  useEffect(() => {
    if (!isClosed || index < 0) return
    const timer = setTimeout(() => {
      const el = listRef.current
      const items = el?.children
      if (el && items && items.length > index) el.scrollTop = items[index].offsetTop
    }, 500)
    return () => clearTimeout(timer)
  }, [index, isClosed])

  return (
    <div ref={listRef} className="main-proxy-navigator" style={style} onMouseLeave={() => setHover(-1)}>
      {list.map((name, i) => {
        // 原版 itemClass 优先级: error > hover > selected
        const cls = ['item']
        if (errorIndexes.includes(i)) cls.push('item-error')
        else if (hover === i) cls.push('item-hover')
        else if (i === index) cls.push('item-selected')
        const shown = isClosed ? removeEmoji(name).trim()[0] : name
        return (
          <div
            key={name}
            className={`clickable ${cls.join(' ')}`}
            onMouseEnter={() => setHover(i)}
            onClick={() => onSelect(i)}
          >
            {shown}
          </div>
        )
      })}
    </div>
  )
}
