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
    <div className="main-setting-view">
      <div className="title">
        <div>Settings</div>
        <div className="btns">
          <div className="btn" onClick={() => s.reset()}>
            Reset All Settings
          </div>
          <div className="btn clickable btn-force-quit" title="Web 版无退出功能">
            Force Quit
          </div>
          <div className="btn clickable btn-quit" title="Web 版无退出功能">
            Quit
          </div>
        </div>
      </div>
      <div className="content">
        <div className="main-setting-section">
          <div className="title">{t('Appearance')}</div>
          <div className="content">
            {!s.systemTheme && (
              <div className="item">
                <div className="relative flex items-center">
                  <div>{t('Theme')}</div>
                </div>
                <div className="relative flex items-center">
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
            <div className="item">
              <div className="relative flex items-center">
                <div>{t('Follow System Theme')}</div>
              </div>
              <div className="relative flex items-center">
                <Switch checked={s.systemTheme} onChange={(v) => s.patch({ systemTheme: v })} />
              </div>
            </div>
            <div className="item">
              <div className="relative flex items-center">
                <div>{t('Language')}</div>
              </div>
              <div className="relative flex items-center">
                <select className="as-text" value={s.lang} onChange={(e) => s.patch({ lang: e.target.value })}>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="main-setting-section">
          <div className="title">{t('Backend')}</div>
          <div className="content">
            <div className="item">
              <div className="relative flex items-center">
                <div>
                  {t('Demo Mode')}
                  <span className="hint">{t('Demo Mode Sub')}</span>
                </div>
              </div>
              <div className="relative flex items-center">
                <Switch checked={s.demoMode} onChange={(v) => s.patch({ demoMode: v })} />
              </div>
            </div>
            {!s.demoMode && (
              <>
                <div className="item">
                  <div className="relative flex items-center">
                    <div>{t('Host')}</div>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      className="as-text short-input"
                      value={s.backend.host}
                      onChange={(e) => s.patchBackend({ host: e.target.value.trim() })}
                      placeholder="127.0.0.1"
                    />
                  </div>
                </div>
                <div className="item">
                  <div className="relative flex items-center">
                    <div>{t('Port')}</div>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      className="as-text shorter-input"
                      value={s.backend.port}
                      onChange={(e) => s.patchBackend({ port: e.target.value.replace(/\D/g, '') })}
                      placeholder="9090"
                    />
                  </div>
                </div>
                <div className="item">
                  <div className="relative flex items-center">
                    <div>{t('Secret')}</div>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      className="as-text short-input"
                      type="password"
                      value={s.backend.secret}
                      onChange={(e) => s.patchBackend({ secret: e.target.value.trim() })}
                    />
                  </div>
                </div>
                <div className="item">
                  <div className="relative flex items-center">
                    <div>{t('Test Connection')}</div>
                  </div>
                  <div className="relative flex items-center">
                    <span className="hint">{status}</span>
                    <span className="clickable" onClick={onTest}>
                      {t('Test Connection')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
