import { useEffect, useMemo, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useSettings } from '../store/settings'
import { useT } from '../hooks/useT'
import { selectProxy, testGroupDelay, updateMode } from '../service'
import Navigator from '../components/Navigator'

// 顺序与 CFW 0.20.39 mode-switcher 一致:Global / Rule / Direct / Script
const MODES = [
  ['global', 'Global', 'merge', 'Routed through the selected proxy'],
  ['rule', 'Rule', 'alt_route', 'Routed according to the rules'],
  ['direct', 'Direct', 'straight', 'Go directly'],
  ['script', 'Script', 'alt_route', 'Routed according to the script'],
]

// 原版 proxy-hint-type 显示类型英文首字母
const TYPE_FIRST = { Selector: 'S', URLTest: 'U', Fallback: 'F', Direct: 'D', Reject: 'R' }

// 原版 proxyItemWidth computed: parseInt>=150 时用设置值, 否则回退 290px
function proxyItemWidthPx(width) {
  return parseInt(width, 10) >= 150 ? `${width}px` : '290px'
}

// 原版 latency:-1 → "- ms";"Timeout" → offline;其他 → online + "N ms"
function latencyInfo(ms, t) {
  if (ms == null) return { text: '- ms', cls: '' }
  if (ms === 0) return { text: t('Timeout'), cls: 'offline' }
  return { text: `${ms} ms`, cls: 'online' }
}

function GroupSection({ name, filterReg, mode, visible, onToggle, blink }) {
  const t = useT()
  const group = useClash((s) => s.proxies[name])
  const delays = useClash((s) => s.delays)
  const nodeMap = useClash((s) => s.proxies)
  const proxyItemWidth = useSettings((s) => s.proxyItemWidth)
  if (!group) return null

  const nodes = group.all?.filter((node) => filterReg.test(node)) ?? []
  const selectable = group.type === 'Selector'
  const itemWidth = proxyItemWidthPx(proxyItemWidth)

  return (
    <div className="proxy-list">
      <div className={`proxy-section${blink ? ' flick' : ''}`} onClick={onToggle}>
        <div className="proxy-section-name">
          <div className="proxy-section-name-left">{name}</div>
          {group.type && (
            <div className={`proxy-hint-type${group.type === 'Selector' ? ' proxy-hint-type-selector' : ''}`}>
              {TYPE_FIRST[group.type] || group.type[0]}
            </div>
          )}
          {group.now && <div className="proxy-hint-line" />}
          {group.now && <div className="proxy-hint">{group.now}</div>}
        </div>
        <div className="proxy-section-right">
          {visible && (
            <span className="sec-icon clickable" title="Scroll to selected proxy">
              <span className="material-icons">travel_explore</span>
            </span>
          )}
          <span className="sec-icon clickable" title="Show/Hide timed-out proxies">
            <span className="material-icons">report</span>
          </span>
          <span
            className="sec-icon clickable"
            title="Test latency"
            onClick={(e) => {
              e.stopPropagation()
              testGroupDelay(name)
            }}
          >
            <span className="material-icons">network_check</span>
          </span>
          {['rule', 'script'].includes(mode) && (
            <span className="sec-icon clickable" title="Show/hide proxies">
              <span className="material-icons">{visible ? 'visibility' : 'visibility_off'}</span>
            </span>
          )}
        </div>
      </div>
      {visible && (
        <div className="proxy-items">
          {nodes.map((node) => {
            const selected = node === group.now
            const { text, cls } = latencyInfo(delays[node], t)
            const meta = nodeMap[node]
            return (
              <div
                key={node}
                className={`proxy-item${selected ? ' selected' : ''}${selectable ? ' clickable' : ''}`}
                style={{ width: itemWidth }}
                onClick={() => selectable && selectProxy(name, node)}
              >
                <div className="indicator" />
                <div className="info">
                  <div className="left">
                    <div className="item-name">{node}</div>
                    <div className="item-bottom">
                      <div className="item-hint">{meta?.type || group.type}</div>
                      {meta?.udp && <div className="item-udp">UDP</div>}
                    </div>
                  </div>
                  <div className={`time ${cls}`}>{text}</div>
                </div>
              </div>
            )
          })}
          {Array.from({ length: 20 }, (_, i) => (
            <i key={i} style={{ width: itemWidth }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Proxies() {
  const t = useT()
  const mode = useClash((s) => s.mode)
  const groupNames = useClash((s) => s.groupNames)
  const groups = mode === 'global' ? ['GLOBAL'] : groupNames
  const showProxyFilter = useSettings((s) => s.showProxyFilter)
  const proxyMiniListWidth = useSettings((s) => s.proxyMiniListWidth)

  const [filterKeyword, setFilterKeyword] = useState('')
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [showSecs, setShowSecs] = useState([])
  const [topItemIndex, setTopItemIndex] = useState(-1)
  const [blinkIndex, setBlinkIndex] = useState(-1)
  const filterInputRef = useRef(null)
  const scrollRef = useRef(null)

  const filterReg = useMemo(() => {
    try {
      return filterKeyword ? new RegExp(filterKeyword, 'i') : /.*/
    } catch {
      return /.*/
    }
  }, [filterKeyword])

  const toggleFilter = () => {
    const next = !isShowFilter
    setIsShowFilter(next)
    if (!next) setFilterKeyword('')
    else setTimeout(() => filterInputRef.current?.focus(), 0)
  }

  const isRuleLike = ['rule', 'script'].includes(mode)
  const isVisible = (name) => !isRuleLike || showSecs.includes(name)
  const toggleSection = (name) => {
    if (!isRuleLike) return
    setShowSecs((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]))
  }

  // navigator 列表排除 GLOBAL(对齐原版 proxyInMode)
  const navigatorList = groups.filter((name) => name !== 'GLOBAL')
  const showNavigator = parseInt(proxyMiniListWidth, 10) !== 0

  // 原版 watch groupBlinkIndex: 变化后 300ms 复位(组闪烁)
  useEffect(() => {
    if (blinkIndex < 0) return
    const timer = setTimeout(() => setBlinkIndex(-1), 300)
    return () => clearTimeout(timer)
  }, [blinkIndex])

  // 原版 handleScroll: [...children,{offsetTop:Infinity}].findIndex(t=>t.offsetTop-120>scrollTop)-1
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const base = el.getBoundingClientRect().top
    const tops = [...el.children].map((c) => c.getBoundingClientRect().top - base + el.scrollTop)
    tops.push(Infinity)
    setTopItemIndex(tops.findIndex((top) => top - 120 > el.scrollTop) - 1)
  }

  // 原版 handleNavigatToGroup: 展开 section + 组闪烁 + scrollTop = children[e].offsetTop - 120
  const navigateToGroup = (idx) => {
    const name = navigatorList[idx]
    if (name && isRuleLike) {
      setShowSecs((prev) => (prev.includes(name) ? prev : [...prev, name]))
    }
    setBlinkIndex(idx)
    setTimeout(() => {
      const el = scrollRef.current
      const children = el?.children
      if (el && children && children[idx]) {
        const base = el.getBoundingClientRect().top
        const top = children[idx].getBoundingClientRect().top - base + el.scrollTop
        el.scrollTop = top - 120
      }
    }, 0)
  }

  return (
    <div id="main-proxy-view">
      <div id="main-mode-switcher">
        <div className="btns">
          {MODES.map(([value, key, icon, hint]) => (
            <div
              key={value}
              className={`btn clickable ${mode === value ? 'selected' : 'normal'}`}
              title={t(hint)}
              onClick={() => updateMode(value)}
            >
              <span>{t(key)}</span>
              <span className="material-icons rotate-90">{icon}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-view" ref={scrollRef} onScroll={handleScroll}>
        {groups.map((name, i) => (
          <GroupSection
            key={name}
            name={name}
            filterReg={filterReg}
            mode={mode}
            visible={isVisible(name)}
            onToggle={() => toggleSection(name)}
            blink={blinkIndex === i}
          />
        ))}
      </div>

      {showNavigator && (
        <Navigator
          list={navigatorList}
          index={topItemIndex}
          width={proxyMiniListWidth}
          errorIndexes={[]}
          onSelect={navigateToGroup}
        />
      )}

      {showProxyFilter && (
        <div className="filter-keyword">
          {isShowFilter && (
            <input
              ref={filterInputRef}
              type="text"
              spellCheck="false"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          )}
          <div onClick={toggleFilter}>
            <span className="material-icons">{isShowFilter ? 'close' : 'filter_list'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
