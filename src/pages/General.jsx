import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import Switch from '../components/Switch'
import { syncConfigs, updateLogLevel } from '../service'

const LEVELS = ['debug', 'info', 'warning', 'error', 'silent']

// 行结构 1:1 对应 CFW:.gitem > .item-left + .item-right(.clickable)
function Gitem({ label, icons = [], children }) {
  return (
    <div className="gitem">
      <div className="item-left">
        {label}
        {icons.map((ic) => (
          <span key={ic.icon} className={`material-icons sec-icon`} title={ic.title}>
            {ic.icon}
          </span>
        ))}
      </div>
      <div className="item-right">{children}</div>
    </div>
  )
}

const DESK = 'Desktop Only'

export default function General() {
  const t = useT()
  const s = useSettings()
  const version = useClash((c) => c.version)

  const toggle = (key, configField) => (val) => {
    s.patch({ [key]: val })
    if (configField) syncConfigs({ [configField]: val })
  }

  const commitPort = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 5)
    s.patchPorts({ mixed: v })
    if (v) syncConfigs({ 'mixed-port': Number(v) })
  }

  const randomPort = () => {
    const v = String(Math.floor(10000 + Math.random() * 50000))
    s.patchPorts({ mixed: v })
    syncConfigs({ 'mixed-port': Number(v) })
  }

  const copyVersion = () => {
    try {
      navigator.clipboard?.writeText(version)
    } catch {
      /* ignore */
    }
  }

  const openRelease = () => {
    window.open('https://github.com/Fndroid/clash_for_windows_pkg/releases', '_blank')
  }

  return (
    <div>
      <div className="general-header">
        <img src="/logo2.png" alt="Clash" />
        <div className="general-title">
          <div className="title-name" title={t('Copy Version')} onClick={copyVersion}>
            Clash for Web
          </div>
          <div className="version" onClick={openRelease}>
            {version || 'v0.0.0'}
          </div>
        </div>
      </div>

      <div className="general-content">
        <Gitem label={t('Port')}>
          <span className="material-icons sec-icon" title={DESK}>
            terminal
          </span>
          <span className="material-icons sec-icon" title={t('Random Port')} onClick={randomPort}>
            shuffle
          </span>
          <input
            className="as-text"
            style={{ width: 56 }}
            value={s.ports.mixed}
            onChange={commitPort}
            onBlur={commitPort}
          />
        </Gitem>

        <Gitem
          label={t('Allow LAN')}
          icons={[{ icon: 'info_outline', title: t('Allow LAN') }, { icon: 'device_hub', title: DESK }]}
        >
          <span className="clickable" title={DESK}>
            Bind: *
          </span>
          <Switch checked={s.allowLan} onChange={toggle('allowLan', 'allow-lan')} />
        </Gitem>

        <Gitem label={t('Log Level')}>
          <select className="as-text" value={s.logLevel} onChange={(e) => updateLogLevel(e.target.value)}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Gitem>

        <Gitem label={t('IPv6')}>
          <Switch checked={s.ipv6} onChange={toggle('ipv6', 'ipv6')} />
        </Gitem>

        <Gitem
          label={t('Clash Core')}
          icons={[
            { icon: 'security', title: DESK },
            { icon: 'memory', title: DESK },
            { icon: 'list_alt', title: DESK },
            { icon: 'play_arrow', title: DESK },
          ]}
        >
          <span className="clickable" title={t('Copy Version')} onClick={copyVersion}>
            {version || '-'}
          </span>
        </Gitem>

        <Gitem label={t('Home Directory')}>
          <span className="clickable" title={DESK}>
            {t('Open Folder')}
          </span>
        </Gitem>

        <Gitem label={t('UWP Loopback')}>
          <span className="clickable" title={DESK}>
            {t('Launch Helper')}
          </span>
        </Gitem>

        <Gitem label={t('TAP Device')}>
          <span className="clickable" title={DESK}>
            {t('Manage')}
          </span>
        </Gitem>

        <Gitem label={t('Service Mode')} icons={[{ icon: 'public', title: DESK }]}>
          <span className="clickable" title={DESK}>
            {t('Manage')}
          </span>
        </Gitem>

        <Gitem
          label={t('Tun Mode')}
          icons={[{ icon: 'info_outline', title: t('Tun Mode') }, { icon: 'settings', title: DESK }]}
        >
          <Switch checked={s.tunMode} onChange={toggle('tunMode')} />
        </Gitem>

        <Gitem
          label={t('Mixin')}
          icons={[{ icon: 'info_outline', title: t('Mixin') }, { icon: 'settings', title: DESK }]}
        >
          <Switch checked={s.mixin} onChange={toggle('mixin')} />
        </Gitem>

        <Gitem label={t('System Proxy')}>
          <Switch checked={s.systemProxy} onChange={toggle('systemProxy')} />
        </Gitem>

        <Gitem label={t('Start with Windows')}>
          <Switch checked={s.autoLaunch} onChange={toggle('autoLaunch')} />
        </Gitem>
      </div>
    </div>
  )
}
