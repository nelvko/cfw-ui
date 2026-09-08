import { useState } from 'react'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import Switch from '../components/Switch'
import { bootstrap } from '../service'

// 原版 Appearance > Theme 的 SelectView 显示文案(值映射 light/dark/red/2077)
const THEME_OPTIONS = [
  ['light', 'Light'],
  ['dark', 'Dark'],
  ['red', '国庆中秋'],
  ['2077', 'Cyberpunk'],
]

export default function Settings() {
  const t = useT()
  const s = useSettings()
  const connected = useClash((c) => c.connected)
  const [testing, setTesting] = useState(false)

  const onTest = async () => {
    setTesting(true)
    await bootstrap()
    setTesting(false)
  }

  const status = testing ? t('Connecting') : connected ? t('Connected') : t('Disconnected')

  return (
    <div className="rows" style={{ paddingTop: 14 }}>
      <div className="section-title">{t('Appearance')}</div>
      {!s.systemTheme && (
        <div className="gitem">
          <div className="item-left">{t('Theme')}</div>
          <div className="item-right">
            <select
              className="as-text"
              style={{ width: 140 }}
              value={s.theme}
              onChange={(e) => s.patch({ theme: e.target.value })}
            >
              {THEME_OPTIONS.map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="gitem">
        <div className="item-left">{t('Follow System Theme')}</div>
        <div className="item-right">
          <Switch checked={s.systemTheme} onChange={(v) => s.patch({ systemTheme: v })} />
        </div>
      </div>
      <div className="gitem">
        <div className="item-left">{t('Language')}</div>
        <div className="item-right">
          <select className="as-text" value={s.lang} onChange={(e) => s.patch({ lang: e.target.value })}>
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="section-title">{t('Backend')}</div>
      <div className="gitem">
        <div className="item-left">
          {t('Demo Mode')}
          <span className="hint" style={{ marginLeft: 4 }}>
            {t('Demo Mode Sub')}
          </span>
        </div>
        <div className="item-right">
          <Switch checked={s.demoMode} onChange={(v) => s.patch({ demoMode: v })} />
        </div>
      </div>
      {!s.demoMode && (
        <>
          <div className="gitem">
            <div className="item-left">{t('Host')}</div>
            <div className="item-right">
              <input
                className="as-text"
                style={{ width: 150 }}
                value={s.backend.host}
                onChange={(e) => s.patchBackend({ host: e.target.value.trim() })}
                placeholder="127.0.0.1"
              />
            </div>
          </div>
          <div className="gitem">
            <div className="item-left">{t('Port')}</div>
            <div className="item-right">
              <input
                className="as-text"
                style={{ width: 80 }}
                value={s.backend.port}
                onChange={(e) => s.patchBackend({ port: e.target.value.replace(/\D/g, '') })}
                placeholder="9090"
              />
            </div>
          </div>
          <div className="gitem">
            <div className="item-left">{t('Secret')}</div>
            <div className="item-right">
              <input
                className="as-text"
                style={{ width: 150 }}
                type="password"
                value={s.backend.secret}
                onChange={(e) => s.patchBackend({ secret: e.target.value.trim() })}
              />
            </div>
          </div>
          <div className="gitem">
            <div className="item-left">{t('Test Connection')}</div>
            <div className="item-right">
              <span className="hint">{status}</span>
              <span className="clickable" onClick={onTest}>
                {t('Test Connection')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
