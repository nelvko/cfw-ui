import { useEffect, useMemo, useState } from 'react'
import { useClash } from '../store/clash'
import { fetchRules, saveRules } from '../service'
import RuleAlterView from '../components/RuleAlterView'

// 原版 randomBGC(renderer.js): 同 proxy 名稳定同色(10~109 深色, 白字)
const colorCache = new Map()
function randomBGC(proxy) {
  if (colorCache.has(proxy)) return colorCache.get(proxy)
  const r = Math.floor(100 * Math.random() + 10)
  const g = Math.floor(100 * Math.random() + 10)
  const b = Math.floor(100 * Math.random() + 10)
  const style = { backgroundColor: `rgb(${r},${g},${b})` }
  colorCache.set(proxy, style)
  return style
}

export default function Rules() {
  const [memoryData, setMemoryData] = useState([])
  const [filterKeywords, setFilterKeywords] = useState('')
  const [showAlterModel, setShowAlterModel] = useState(false)
  const [saveBtnText, setSaveBtnText] = useState('Save')

  const groupNames = useClash((s) => s.groupNames)
  const proxies = useClash((s) => s.proxies)

  useEffect(() => {
    fetchRules().then((rules) => setMemoryData(rules.slice(0, 100)))
  }, [])

  // 原版 mounted: proxyGroups = ["DIRECT","REJECT", ...proxy-groups 名, ...单节点名]
  const proxyGroups = useMemo(() => {
    const singles = Object.values(proxies || {})
      .filter(
        (p) => !['GLOBAL', 'DIRECT', 'REJECT', 'COMPATIBLE'].includes(p.name) && !groupNames.includes(p.name),
      )
      .map((p) => p.name)
    return ['DIRECT', 'REJECT', ...groupNames, ...singles]
  }, [groupNames, proxies])

  // 原版 loadData 过滤: 空格分词 join("|") 正则, 匹配 proxy/payload/type, 取前 100
  const listData = useMemo(() => {
    const kw = filterKeywords.trim()
    if (!kw) return memoryData.slice(0, 100)
    const reg = new RegExp(kw.split(/\s+/).join('|'), 'i')
    return memoryData
      .filter((r) => reg.test(r.proxy) || reg.test(r.payload) || reg.test(r.type))
      .slice(0, 100)
  }, [memoryData, filterKeywords])

  const removeItem = (item) => {
    setMemoryData((prev) => {
      const i = prev.findIndex(
        (t) => t.payload === item.payload && t.proxy === item.proxy && t.type === item.type,
      )
      return i > -1 ? prev.filter((_, idx) => idx !== i) : prev
    })
  }

  // 原版 moveItem: 删除后 top ? unshift : push
  const moveItem = (top, item) => {
    setMemoryData((prev) => {
      const i = prev.findIndex(
        (t) => t.payload === item.payload && t.proxy === item.proxy && t.type === item.type,
      )
      const next = i > -1 ? prev.filter((_, idx) => idx !== i) : prev
      return top ? [item, ...next] : [...next, item]
    })
  }

  // 原版 inputDone: 关闭弹窗, 新增规则 unshift
  const inputDone = (rule) => {
    setShowAlterModel(false)
    if (rule) setMemoryData((prev) => [rule, ...prev])
  }

  // 原版 applyRules: 序列化写回; Web 版经 service.saveRules
  const applyRules = async () => {
    try {
      await saveRules(memoryData)
      setSaveBtnText('Done')
    } catch {
      setSaveBtnText('Fail')
    }
    setTimeout(() => setSaveBtnText('Save'), 3000)
  }

  // 原版 cancel: 关闭编辑器; Web 版独立页等价于放弃未保存修改(重新加载)
  const handleCancel = () => {
    fetchRules().then((rules) => setMemoryData(rules.slice(0, 100)))
    setFilterKeywords('')
  }

  // 原版 handleRuleClick: RULE-SET 触发 provider 更新; Web 版无 providers 后端
  const handleRuleClick = (item) => {
    if (item.type === 'RULE-SET') {
      console.warn('[cfw] RULE-SET update: 无 provider 写接口')
    }
  }

  return (
    <div id="main-rule-view">
      <div className="header">
        <div className="title">Top 100 matching rules({memoryData.length}).</div>
        <div className="header-btns">
          <div className="btn btn-add" onClick={() => setShowAlterModel(true)}>
            Add
          </div>
          <div className="btn btn-save" onClick={applyRules}>
            {saveBtnText}
          </div>
          <div className="btn btn-back" onClick={handleCancel}>
            Cancel
          </div>
        </div>
      </div>

      <div className="filter-view">
        <input
          type="text"
          placeholder="fiter by keywords"
          value={filterKeywords}
          onChange={(e) => setFilterKeywords(e.target.value)}
        />
      </div>

      <div className="log-list">
        {listData.map((r, i) => (
          <div key={i} className="log-item" title={r.payload} onClick={() => handleRuleClick(r)}>
            <div className="left">
              <div className="url">{r.payload}</div>
              <div className="rule">{r.type}</div>
            </div>
            <div className="right-main">
              <div className="right" style={randomBGC(r.proxy)}>
                {r.proxy}
              </div>
              <span
                className="material-icons ctl-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  moveItem(true, r)
                }}
              >
                north
              </span>
              <span
                className="material-icons ctl-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  moveItem(false, r)
                }}
              >
                south
              </span>
              <span
                className="material-icons ctl-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  removeItem(r)
                }}
              >
                delete
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAlterModel && (
        <RuleAlterView
          proxyGroups={proxyGroups}
          onClose={() => setShowAlterModel(false)}
          onDone={inputDone}
        />
      )}
    </div>
  )
}
