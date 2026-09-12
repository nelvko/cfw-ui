import { useEffect, useMemo, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useSettings } from '../store/settings'
import { useT } from '../hooks/useT'
import { selectProxy, testGroupDelay, updateMode } from '../service'
import Navigator from '../components/Navigator'
import Hint from '../components/Hint'

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

function GroupSection({
  name,
  filterReg,
  mode,
  visible,
  onToggle,
  blink,
  index,
  showSelected,
  hideTimeout,
  onSwitchHideTimeout,
  onScrollToSelected,
}) {
  const t = useT()
  const group = useClash((s) => s.proxies[name])
  const delays = useClash((s) => s.delays)
  const nodeMap = useClash((s) => s.proxies)
  const proxyItemWidth = useSettings((s) => s.proxyItemWidth)
  if (!group) return null

  // 原版: hideTimeoutSecNames 命中的组隐藏超时节点(delay===0)
  const nodes =
    group.all?.filter((node) => filterReg.test(node) && (!hideTimeout || delays[node] !== 0)) ?? []
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
          {showSelected && (
            <Hint
              className="sec-icon clickable"
              hint="Scroll to selected proxy"
              position="top"
              onClick={(e) => {
                e.stopPropagation()
                onScrollToSelected(index)
              }}
            >
              <span className="material-icons">travel_explore</span>
            </Hint>
          )}
          <Hint
            className="sec-icon clickable"
            hint="Show/Hide timed-out proxies"
            position="top"
            onClick={(e) => {
              e.stopPropagation()
              onSwitchHideTimeout(name)
            }}
          >
            <span className="material-icons">{hideTimeout ? 'report_off' : 'report'}</span>
          </Hint>
          <Hint
            className="sec-icon clickable"
            hint="Test latency"
            position="top"
            onClick={(e) => {
              e.stopPropagation()
              testGroupDelay(name)
            }}
          >
            <span className="material-icons">network_check</span>
          </Hint>
          {['rule', 'script'].includes(mode) && (
            <Hint className="sec-icon clickable" hint="Show/hide proxies" position="left">
              <span className="material-icons">{visible ? 'visibility' : 'visibility_off'}</span>
            </Hint>
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
  const proxyShowSecIdxs = useSettings((s) => s.proxyShowSecIdxs)

  const [filterKeyword, setFilterKeyword] = useState('')
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [showSecs, setShowSecs] = useState([])
  const [topItemIndex, setTopItemIndex] = useState(-1)
  const [blinkIndex, setBlinkIndex] = useState(-1)
  // 原版 hideTimeoutSecNames(组件内临时 state): 命中组隐藏超时节点
  const [hideTimeoutSecNames, setHideTimeoutSecNames] = useState([])
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

  // 原版 handleNavigatToGroup: 展开 section + 记入 showSecIdxs + 组闪烁 + scrollTop = children[e].offsetTop - 120
  const navigateToGroup = (idx) => {
    const name = navigatorList[idx]
    if (name && isRuleLike) {
      setShowSecs((prev) => (prev.includes(name) ? prev : [...prev, name]))
    }
    if (!proxyShowSecIdxs.includes(idx)) {
      useSettings.getState().patch({ proxyShowSecIdxs: [...proxyShowSecIdxs, idx] })
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

  // 原版 switchHideTimeout: 切换某组是否隐藏超时节点
  const switchHideTimeout = (name) => {
    setHideTimeoutSecNames((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    )
  }

  // 原版 scrollToSelected(e): 组闪烁 + 若选中节点不在可视区则滚到 offsetTop-160
  const scrollToSelected = (idx) => {
    setBlinkIndex(idx)
    setTimeout(() => {
      const el = scrollRef.current
      const section = el?.children?.[idx]
      if (!el || !section) return
      const items = section.querySelectorAll('.proxy-item')
      let selected = null
      for (const it of items) {
        if (it.classList.contains('selected')) {
          selected = it
          break
        }
      }
      if (!selected) return
      const base = el.getBoundingClientRect().top
      const top = selected.getBoundingClientRect().top - base + el.scrollTop
      const target = top - 160
      if (target < el.scrollTop || target > el.scrollTop + el.clientHeight - 200) {
        el.scrollTop = target
      }
    }, 0)
  }

  return (
    <div id="main-proxy-view">
      <div id="main-mode-switcher">
        <div className="btns">
          {MODES.map(([value, key, icon, hint]) => (
            <Hint
              key={value}
              className={`gap-x-2 clickable btn ${mode === value ? 'selected' : 'normal'}`}
              style={{ flexDirection: 'row' }}
              hint={t(hint)}
              position="bottom"
              onClick={() => updateMode(value)}
            >
              <span>{t(key)}</span>
              <div className="material-icons rotate-90">{icon}</div>
            </Hint>
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
            index={i}
            showSelected={proxyShowSecIdxs.includes(i)}
            hideTimeout={hideTimeoutSecNames.includes(name)}
            onSwitchHideTimeout={switchHideTimeout}
            onScrollToSelected={scrollToSelected}
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
