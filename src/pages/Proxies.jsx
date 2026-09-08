import { useMemo, useRef, useState } from 'react'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import { selectProxy, testAllDelay, testGroupDelay, updateMode } from '../service'

// 顺序与 CFW 0.20.39 mode-switcher 一致:Global / Rule / Direct / Script
const MODES = [
  ['global', 'Global', 'merge', 'Routed through the selected proxy'],
  ['rule', 'Rule', 'alt_route', 'Routed according to the rules'],
  ['direct', 'Direct', 'straight', 'Go directly'],
  ['script', 'Script', 'alt_route', 'Routed according to the script'],
]

const TYPE_KEYS = { Selector: 'Selector', URLTest: 'URLTest', Fallback: 'Fallback' }

function delayInfo(ms, t) {
  if (ms == null) return { text: '--', cls: '' }
  if (ms === 0) return { text: t('Timeout'), cls: 'bad' }
  if (ms <= 200) return { text: `${ms} ms`, cls: 'good' }
  if (ms <= 500) return { text: `${ms} ms`, cls: 'mid' }
  return { text: `${ms} ms`, cls: 'bad' }
}

function GroupCard({ name, filterReg }) {
  const t = useT()
  const group = useClash((s) => s.proxies[name])
  const delays = useClash((s) => s.delays)
  if (!group) return null

  const nodes = group.all?.filter((node) => filterReg.test(node)) ?? []

  const selectable = group.type === 'Selector'
  const typeLabel = TYPE_KEYS[group.type] ? t(TYPE_KEYS[group.type]) : group.type

  return (
    <div className="group-card">
      <div className="group-head">
        <span className="group-name ell">{name}</span>
        <button
          type="button"
          className="icon-btn"
          title={t('Test Delay')}
          onClick={() => testGroupDelay(name)}
        >
          <span className="material-icons">bolt</span>
        </button>
        <span className="group-type">{typeLabel}</span>
      </div>
      <div className="group-now">
        <span className="material-icons">check_circle</span>
        <span className="ell">{group.now}</span>
      </div>
      <div className="nodes">
        {nodes.map((node) => {
          const selected = node === group.now
          const { text, cls } = delayInfo(delays[node], t)
          return (
            <button
              key={node}
              type="button"
              className={`node${selected ? ' on' : ''}${selectable ? '' : ' static'}`}
              onClick={() => selectable && selectProxy(name, node)}
            >
              <span className="node-name">{node}</span>
              <span className={`delay ${cls}`}>{text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Proxies() {
  const t = useT()
  const mode = useClash((s) => s.mode)
  const groupNames = useClash((s) => s.groupNames)
  const testing = useClash((s) => s.testing)
  const groups = mode === 'global' ? ['GLOBAL'] : groupNames

  const [filterKeyword, setFilterKeyword] = useState('')
  const [isShowFilter, setIsShowFilter] = useState(false)
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
    if (!next) {
      setFilterKeyword('')
    } else {
      setTimeout(() => filterInputRef.current?.focus(), 0)
    }
  }

  return (
    <div>
      <div className="mode-switcher">
        <div className="btns">
          {MODES.map(([value, key, icon, hint]) => (
            <button
              key={value}
              type="button"
              className={`btn${mode === value ? ' selected' : ''}`}
              title={t(hint)}
              onClick={() => updateMode(value)}
            >
              <span>{t(key)}</span>
              <span className="material-icons rotate-90">{icon}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="icon-btn"
          style={{ marginLeft: 16 }}
          title={testing ? t('Testing') : t('Test Delay')}
          disabled={testing}
          onClick={testAllDelay}
        >
          <span className="material-icons">bolt</span>
        </button>
      </div>

      <div className="groups">
        {groups.map((name) => (
          <GroupCard key={name} name={name} filterReg={filterReg} />
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
        <button type="button" className="kw-btn" onClick={toggleFilter}>
          <span className="material-icons">{isShowFilter ? 'close' : 'filter_list'}</span>
        </button>
      </div>
    </div>
  )
}
