import { useState } from 'react'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import Switch from '../components/Switch'
import SelectView from '../components/SelectView'
import SimpleInput from '../components/SimpleInput'
import { bootstrap } from '../service'

// 原版 Appearance > Theme 的 SelectView(renderer.js @3178564):
// items Light/Dark/国庆中秋/Cyberpunk, 值映射 light/dark/red/2077(store 索引)
const THEME_VALUES = ['light', 'dark', 'red', '2077']
const THEME_LABELS = ['Light', 'Dark', '国庆中秋', 'Cyberpunk']

// 特例(Web 版新增):原版 CFW 纯英文界面无语言切换项。
// 语言与主题同属界面外观,故放入 Appearance 区块,用 SelectView 保持原版设计语言。
const LANG_VALUES = ['zh', 'en']
const LANG_LABELS = ['中文', 'English']

// 原版 fontFamilyPlaceholder: Mac→PingFang SC, Windows→Microsoft Yahei, 其他→system-ui
const FONT_FAMILY_PLACEHOLDER = /Mac/i.test(navigator.platform)
  ? 'PingFang SC'
  : /Win/i.test(navigator.platform)
    ? 'Microsoft Yahei'
    : 'system-ui'

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
                <div>{t('Theme')}</div>
                <SelectView
                  items={THEME_LABELS}
                  value={Math.max(0, THEME_VALUES.indexOf(s.theme))}
                  onChange={(i) => s.patch({ theme: THEME_VALUES[i] })}
                />
              </div>
            )}
            <div className="item">
              <div>{t('Follow System Theme')}</div>
              <Switch checked={s.systemTheme} onChange={(v) => s.patch({ systemTheme: v })} />
            </div>
            <div className="item">
              <div>{t('Font Family')}</div>
              <SimpleInput
                value={s.fontFamily}
                onChange={(v) => s.patch({ fontFamily: v })}
                placeholder={FONT_FAMILY_PLACEHOLDER}
              />
            </div>
            <div className="item">
              <div>{t('Use System Emoji')}</div>
              <Switch checked={s.useSystemEmoji} onChange={(v) => s.patch({ useSystemEmoji: v })} />
            </div>
            <div className="item">
              <div>{t('Language')}</div>
              <SelectView
                items={LANG_LABELS}
                value={Math.max(0, LANG_VALUES.indexOf(s.lang))}
                onChange={(i) => s.patch({ lang: LANG_VALUES[i] })}
              />
            </div>
          </div>
        </div>

        <div className="main-setting-section">
          <div className="title">Proxies</div>
          <div className="content">
            <div className="item">
              <div className="flex items-center">
                <div>Proxy Item Width</div>
                <span className="hint">Set the display width of each proxy in the Proxies module</span>
              </div>
              <SimpleInput
                value={s.proxyItemWidth}
                onChange={(v) => s.patch({ proxyItemWidth: v })}
                placeholder="290"
                suffix="px"
              />
            </div>
            <div className="item">
              <div className="flex items-center">
                <div>Mini List Width</div>
                <span className="hint">Set the width of the minilist in the Proxies module</span>
              </div>
              <SimpleInput
                value={s.proxyMiniListWidth}
                onChange={(v) => s.patch({ proxyMiniListWidth: v })}
                placeholder="100(0=hide)"
                suffix="px"
              />
            </div>
            <div className="item">
              <div className="flex items-center">
                <div>Show Filter</div>
                <span className="hint">Set the Proxies module to display the keyword filter icon or not</span>
              </div>
              <Switch checked={s.showProxyFilter} onChange={(v) => s.patch({ showProxyFilter: v })} />
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
