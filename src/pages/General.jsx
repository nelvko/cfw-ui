import { useState } from 'react'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import Switch from '../components/Switch'
import { syncConfigs, updateLogLevel } from '../service'

const LEVELS = ['debug', 'info', 'warning', 'error', 'silent']
const DESK = 'Desktop Only'

// 与原版 InfoIcon 一致:info 图标,16px,opacity 0.7
function InfoIcon({ text }) {
  return (
    <span className="info-icon-main" title={text}>
      <span className="material-icons info-icon-text">info</span>
    </span>
  )
}

// 与原版 Hint 一致:可操作设置图标,24x24,hover 背景
function HintIcon({ icon, title, onClick, style, className = 'tun-settings-icon' }) {
  return (
    <span className={`material-icons ${className}`.trim()} title={title} onClick={onClick} style={style}>
      {icon}
    </span>
  )
}

function Gitem({ label, info, icons = [], children }) {
  return (
    <div className="gitem">
      <div className="item-left">
        <div>{label}</div>
        {info && <InfoIcon text={info} />}
        {icons.map((ic) => (
          <HintIcon key={ic.icon} icon={ic.icon} title={ic.title} onClick={ic.onClick} style={ic.style} />
        ))}
      </div>
      <div className="item-right">{children}</div>
    </div>
  )
}

export default function General() {
  const t = useT()
  const s = useSettings()
  const version = useClash((c) => c.version)
  const [editingPort, setEditingPort] = useState(false)
  const [portDraft, setPortDraft] = useState('')

  const toggle = (key, configField) => (val) => {
    s.patch({ [key]: val })
    if (configField) syncConfigs({ [configField]: val })
  }

  const toggleRandomPort = () => {
    const next = !s.randomMixedPort
    s.patch({ randomMixedPort: next })
    if (next) {
      const v = String(Math.floor(10000 + Math.random() * 50000))
      s.patchPorts({ mixed: v })
      syncConfigs({ 'mixed-port': Number(v) })
    }
  }

  const openEditPort = () => {
    setPortDraft(s.ports.mixed)
    setEditingPort(true)
  }

  const commitPort = () => {
    const v = portDraft.replace(/\D/g, '').slice(0, 5)
    if (v) {
      s.patchPorts({ mixed: v })
      syncConfigs({ 'mixed-port': Number(v) })
    }
    setEditingPort(false)
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
    <div className="main-general-view">
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
          <span className="material-icons control-icon" title={DESK}>
            terminal
          </span>
          <span
            className="material-icons control-icon"
            title="random mixed port"
            style={{ color: s.randomMixedPort ? '#41b883' : '#b3b3b3' }}
            onClick={toggleRandomPort}
          >
            {s.randomMixedPort ? 'sync' : 'sync_disabled'}
          </span>
          <span className="clickable" onClick={openEditPort}>
            {s.ports.mixed}
          </span>
        </Gitem>

        <Gitem
          label={t('Allow LAN')}
          info="Turn on to listen on all interfaces by default, or else only listen on 127.0.0.1."
          icons={[{ icon: 'device_hub', title: 'network interfaces' }]}
        >
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
            { icon: 'gpp_maybe', title: 'add firewall rules(for Allow LAN and system stack)' },
            { icon: 'memory', title: 'Preview the final configuration file that was submitted to Clash Core' },
            { icon: 'dns', title: 'Resolve a host using Clash core' },
            { icon: 'play_arrow', title: 'Test script using by Script mode' },
          ]}
        >
          <span className="clickable" title={t('Copy Version')} onClick={copyVersion}>
            {version || '-'} ({s.backend.port})
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

        <Gitem
          label={t('Service Mode')}
          icons={[
            {
              icon: 'public',
              title: DESK,
              className: '',
              style: { color: '#b3b3b3', fontSize: '18px', marginLeft: '5px', marginTop: '2px' },
            },
          ]}
        >
          <span className="clickable" title={DESK}>
            {t('Manage')}
          </span>
        </Gitem>

        <Gitem
          label={t('Tun Mode')}
          info="To enable this mode, please install Service Mode first!"
          icons={[{ icon: 'settings', title: 'Settings' }]}
        >
          <Switch checked={s.tunMode} onChange={toggle('tunMode')} />
        </Gitem>

        <Gitem
          label={t('Mixin')}
          info="Mixin allows you to overwrite the original configuration file."
          icons={[{ icon: 'settings', title: 'Edit Mixin content' }]}
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

      {editingPort && (
        <div className="mask" onMouseDown={() => setEditingPort(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-title">Mixed Port</div>
            <div className="modal-body">
              <input
                className="as-text"
                style={{ width: '100%', textAlign: 'left' }}
                value={portDraft}
                onChange={(e) => setPortDraft(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={() => setEditingPort(false)}>
                {t('Cancel')}
              </button>
              <button type="button" className="btn primary" onClick={commitPort}>
                {t('Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
