import { useState } from 'react'

// 原版 RuleAlterView(renderer.js scoped eea841c4): 新增规则弹窗
const RULE_TYPES = [
  'DOMAIN-SUFFIX',
  'DOMAIN',
  'DOMAIN-KEYWORD',
  'IP-CIDR',
  'SRC-IP-CIDR',
  'GEOIP',
  'PROCESS-NAME',
  'DST-PORT',
  'SRC-PORT',
  'MATCH',
]

export default function RuleAlterView({ proxyGroups = [], onClose, onDone }) {
  const [selectedType, setSelectedType] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [content, setContent] = useState('')

  // 原版 inputDone: MATCH 只需 group; 其余需 content + type + group; 不满足则 done(null)
  const inputDone = () => {
    let rule = null
    if (selectedType === 'MATCH' && selectedGroup) {
      rule = { type: selectedType, payload: '', proxy: selectedGroup, params: '' }
    } else if (content && selectedType && selectedGroup) {
      rule = { type: selectedType, payload: content, proxy: selectedGroup, params: '' }
    }
    onDone(rule)
  }

  return (
    <div className="modal-mask" onMouseDown={onClose}>
      <div className="modal-wrapper">
        <div className="modal-container" onMouseDown={(e) => e.stopPropagation()}>
          <div className="model-title">
            <div>Create a new rule</div>
            <div className="rule-floating-btns">
              <div className="rule-floating-ok" onClick={inputDone}>
                Add
              </div>
              <div className="rule-floating-cancel" onClick={onClose}>
                Cancel
              </div>
            </div>
          </div>
          <div className="scroll-view">
            {selectedType !== 'MATCH' && (
              <>
                <div className="rule-section-title">Content</div>
                <div>
                  <input
                    type="text"
                    placeholder="eg: google.com"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="rule-section-title">Type</div>
            <div className="rule-type-group">
              {RULE_TYPES.map((t) => (
                <div
                  key={t}
                  className={`rule-type-item${t === selectedType ? ' rule-type-selected' : ''}`}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </div>
              ))}
            </div>
            <div className="rule-section-title">Proxy or Policy</div>
            <div className="rule-proxy-group">
              {proxyGroups.map((g) => (
                <div
                  key={g}
                  className={`rule-proxy-item${g === selectedGroup ? ' rule-proxy-selected' : ''}`}
                  onClick={() => setSelectedGroup(g)}
                >
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
