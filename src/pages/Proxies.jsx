import { useMemo, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import { selectProxy, testGroupDelay, updateMode } from '../service'

// 顺序与 CFW 0.20.39 mode-switcher 一致:Global / Rule / Direct / Script
const MODES = [
  ['global', 'Global', 'merge', 'Routed through the selected proxy'],
  ['rule', 'Rule', 'alt_route', 'Routed according to the rules'],
  ['direct', 'Direct', 'straight', 'Go directly'],
  ['script', 'Script', 'alt_route', 'Routed according to the script'],
]

// 原版 proxy-hint-type 显示类型英文首字母
const TYPE_FIRST = { Selector: 'S', URLTest: 'U', Fallback: 'F', Direct: 'D', Reject: 'R' }

// 原版 latency:-1 → "- ms";"Timeout" → offline;其他 → online + "N ms"
function latencyInfo(ms, t) {
  if (ms == null) return { text: '- ms', cls: '' }
  if (ms === 0) return { text: t('Timeout'), cls: 'offline' }
  return { text: `${ms} ms`, cls: 'online' }
}

function GroupSection({ name, filterReg, mode, visible, onToggle }) {
  const t = useT()
  const group = useClash((s) => s.proxies[name])
  const delays = useClash((s) => s.delays)
  const nodeMap = useClash((s) => s.proxies)
  if (!group) return null

  const nodes = group.all?.filter((node) => filterReg.test(node)) ?? []
  const selectable = group.type === 'Selector'

  return (
    <div className="proxy-list">
      <div className="proxy-section" onClick={onToggle}>
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
            <i key={i} />
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

  const [filterKeyword, setFilterKeyword] = useState('')
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [showSecs, setShowSecs] = useState([])
  const filterInputRef = useRef(null)

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

      <div className="scroll-view">
        {groups.map((name) => (
          <GroupSection
            key={name}
            name={name}
            filterReg={filterReg}
            mode={mode}
            visible={isVisible(name)}
            onToggle={() => toggleSection(name)}
          />
        ))}
      </div>

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
    </div>
  )
}
