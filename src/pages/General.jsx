import { useState } from 'react'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'
import { useT } from '../hooks/useT'
import Switch from '../components/Switch'
import Hint from '../components/Hint'
import InfoIcon from '../components/InfoIcon'
import InterfacesView from '../components/InterfacesView'
import { syncConfigs, updateLogLevel } from '../service'

// 与原版 handleEditLogLevel 的 $select items 顺序一致(降序)
const LEVELS = ['silent', 'error', 'warning', 'info', 'debug']

function Gitem({ label, info, icons = [], children }) {
  return (
    <div className="gitem">
      <div className="item-left">
        <div>{label}</div>
        {info && <InfoIcon>{info}</InfoIcon>}
        {icons.map((ic) =>
          ic.title ? (
            // 原版把尺寸类挂在 Hint 根元素上, 只留纯图标 span 作为子节点
            <Hint
              key={ic.icon}
              className={ic.className ?? 'tun-settings-icon'}
              hint={ic.title}
              position={ic.position}
              style={ic.style}
              onClick={ic.onClick}
            >
              <span className="material-icons">{ic.icon}</span>
            </Hint>
          ) : (
            <span
              key={ic.icon}
              className={`material-icons ${ic.className ?? ''}`.trim()}
              style={ic.style}
              onClick={ic.onClick}
            >
              {ic.icon}
            </span>
          ),
        )}
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
  const [editingLogLevel, setEditingLogLevel] = useState(false)
  const [interfacesVisible, setInterfacesVisible] = useState(false)

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
          <div className="title-name" onClick={copyVersion}>
            Clash for Web
          </div>
          <div className="version" onClick={openRelease}>
            {version || 'v0.0.0'}
          </div>
        </div>
      </div>

      <div className="general-content">
        <Gitem label={t('Port')}>
          <Hint hint="terminal" className="mr-2">
            <span className="material-icons control-icon">terminal</span>
          </Hint>
          <Hint hint="random mixed port">
            <span
              className="material-icons control-icon"
              style={{ color: s.randomMixedPort ? '#41b883' : '#b3b3b3' }}
              onClick={toggleRandomPort}
            >
              {s.randomMixedPort ? 'sync' : 'sync_disabled'}
            </span>
          </Hint>
          <span className="clickable" onClick={openEditPort}>
            {s.ports.mixed}
          </span>
        </Gitem>

        <Gitem
          label={t('Allow LAN')}
          info={
            <>
              Turn on to listen on all interfaces by default, or else only listen on 127.0.0.1. You
              can change the Bind Address on the right side to specify a particular interface.{' '}
              <a href="https://github.com/Dreamacro/clash/pull/2818" target="_blank" rel="noreferrer">
                Inbounds
              </a>
            </>
          }
          icons={[
            {
              icon: 'device_hub',
              title: 'network interfaces',
              position: 'right',
              onClick: () => setInterfacesVisible(true),
            },
          ]}
        >
          <Switch checked={s.allowLan} onChange={toggle('allowLan', 'allow-lan')} />
        </Gitem>

        <Gitem label={t('Log Level')}>
          <span className="clickable" onClick={() => setEditingLogLevel(true)}>
            {s.logLevel}
          </span>
        </Gitem>

        <Gitem label={t('IPv6')}>
          <Switch checked={s.ipv6} onChange={toggle('ipv6', 'ipv6')} />
        </Gitem>

        <Gitem
          label={t('Clash Core')}
          icons={[
            {
              icon: 'gpp_maybe',
              title: 'add firewall rules(for Allow LAN and system stack)',
              position: 'right',
            },
            {
              icon: 'memory',
              title: 'Preview the final configuration file that was submitted to Clash Core',
              position: 'right',
            },
            { icon: 'dns', title: 'Resolve a host using Clash core', position: 'right' },
            { icon: 'play_arrow', title: 'Test script using by Script mode', position: 'right' },
          ]}
        >
          <span className="clickable" onClick={copyVersion}>
            {version || '-'} ({s.backend.port})
          </span>
        </Gitem>

        <Gitem label={t('Home Directory')}>
          <span className="clickable">{t('Open Folder')}</span>
        </Gitem>

        <Gitem label={t('UWP Loopback')}>
          <span className="clickable">{t('Launch Helper')}</span>
        </Gitem>

        <Gitem label={t('TAP Device')}>
          <span className="clickable">{t('Manage')}</span>
        </Gitem>

        <Gitem
          label={t('Service Mode')}
          icons={[
            {
              icon: 'public',
              className: '',
              style: { color: '#b3b3b3', fontSize: '18px', marginLeft: '5px', marginTop: '2px' },
            },
          ]}
        >
          <span className="clickable">{t('Manage')}</span>
        </Gitem>

        <Gitem
          label={t('Tun Mode')}
          info="To enable this mode, please install Service Mode first!"
          icons={[{ icon: 'settings', title: 'Settings', position: 'right' }]}
        >
          <Switch checked={s.tunMode} onChange={toggle('tunMode')} />
        </Gitem>

        <Gitem
          label={t('Mixin')}
          info={
            <>
              Mixin allows you to overwrite the original configuration file.{' '}
              <a href="https://docs.cfw.lbyczf.com/contents/mixin.html" target="_blank" rel="noreferrer">
                Docs
              </a>
            </>
          }
          icons={[{ icon: 'settings', title: 'Edit Mixin content', position: 'right' }]}
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

      {editingLogLevel && (
        <div className="mask" onMouseDown={() => setEditingLogLevel(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-title">Change Log Level</div>
            <div className="modal-body">silent will prevent .log file to generate on next startup</div>
            <div className="modal-footer">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className="btn"
                  onClick={() => {
                    updateLogLevel(l)
                    setEditingLogLevel(false)
                  }}
                >
                  {l}
                </button>
              ))}
              <button type="button" className="btn" onClick={() => setEditingLogLevel(false)}>
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {interfacesVisible && <InterfacesView onClose={() => setInterfacesVisible(false)} />}
    </div>
  )
}
