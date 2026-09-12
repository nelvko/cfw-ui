import { useEffect, useRef, useState } from 'react'
import { useSettings } from '../store/settings'
import { useT } from '../hooks/useT'
import { importProfile, updateProfileById } from '../service'
import { fmtBytes, fmtDateTime } from '../utils/format'
import Hint from '../components/Hint'

const parseDomain = (url) => {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

// 原版 profile 右键菜单(14 项)。web 环境下部分 Electron 专属项仅占位。
function buildMenu(t) {
  return [
    { icon: 'home', text: 'Open web page', hide: true },
    { icon: 'edit', text: 'Edit', action: 'edit' },
    { icon: 'edit', text: 'Edit externally', action: 'noop' },
    { icon: 'refresh', text: 'Update', action: 'update', hideWhenLocal: true },
    { icon: 'folder', text: 'Show in folder', action: 'noop' },
    { icon: 'merge_type', text: 'Diff', action: 'noop', hideWhenLocal: true },
    { icon: 'send', text: 'Proxies', action: 'noop' },
    { icon: 'rule', text: 'Rules', action: 'noop' },
    { icon: 'content_copy', text: 'Copy', action: 'copy' },
    { icon: 'qr_code', text: 'QRCode', action: 'noop', hideWhenLocal: true },
    { icon: 'account_tree', text: 'Parsers', action: 'noop', hideWhenLocal: true },
    { icon: 'code', text: 'Run script', action: 'noop' },
    { icon: 'settings', text: 'Settings', action: 'edit' },
    { icon: 'delete', text: 'Delete', action: 'delete' },
  ]
}

export default function Profiles() {
  const t = useT()
  const profiles = useSettings((s) => s.profiles)
  const activeId = useSettings((s) => s.activeProfileId)
  const setActive = useSettings((s) => s.setActiveProfile)
  const remove = useSettings((s) => s.removeProfile)
  const update = useSettings((s) => s.updateProfile)

  const [subUrl, setSubUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [menu, setMenu] = useState(null)
  const [editing, setEditing] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(null)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const onDownload = async () => {
    if (!subUrl.trim() || loading) return
    setLoading(true)
    try {
      await importProfile(subUrl.trim())
      setSubUrl('')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onUpdate = async (p) => {
    setUpdatingId(p.id)
    await updateProfileById(p.id)
    setUpdatingId(null)
  }

  const onUpdateAll = async () => {
    for (const p of profiles) {
      if (p.url) await updateProfileById(p.id)
    }
  }

  const onMenuAction = (item, profile) => {
    setMenu(null)
    switch (item.action) {
      case 'edit':
        setEditing({ ...profile, name: profile.name, url: profile.url })
        break
      case 'update':
        onUpdate(profile)
        break
      case 'copy': {
        const copy = { ...profile, id: crypto.randomUUID(), name: `${profile.name} (copy)` }
        useSettings.getState().addProfile(copy)
        break
      }
      case 'delete':
        remove(profile.id)
        break
      default:
        break
    }
  }

  const saveEdit = () => {
    if (!editing.name.trim()) return
    update(editing.id, { name: editing.name.trim(), url: editing.url.trim() })
    setEditing(null)
  }

  return (
    <div className="main">
      <div className="card remote-view">
        <div className="input-container">
          <input
            className="profile-input"
            type="text"
            spellCheck="false"
            placeholder="Download from a URL"
            value={subUrl}
            onChange={(e) => setSubUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onDownload()}
          />
          <span
            className="material-icons clear-icon"
            onClick={() => (subUrl ? setSubUrl('') : navigator.clipboard?.readText().then((x) => setSubUrl(x)))}
          >
            {subUrl ? 'backspace' : 'content_copy'}
          </span>
        </div>
        <div className="btns-container">
          <div className="confirm confirm-left" onClick={onDownload}>
            {loading ? 'Downloading' : 'Download'}
          </div>
          <div className="confirm confirm-right update-all-btn" onClick={onUpdateAll}>
            Update All
          </div>
          <div className="confirm confirm-right" onClick={onDownload}>
            Import
          </div>
        </div>
      </div>

      <div className="list-view">
        {profiles.map((p) => {
          const cur = p.id === activeId
          const remote = !!p.url
          const pct = p.total ? Math.min(100, (p.used / p.total) * 100) : 0
          return (
            <div
              key={p.id}
              className={`list-item${cur ? ' item-cur' : ''}`}
              onClick={() => setActive(p.id)}
              onContextMenu={(e) => {
                e.preventDefault()
                setMenu({ x: e.clientX, y: e.clientY, profile: p })
              }}
            >
              <div className="indicator">
                {cur && (
                  <>
                    <div className="indicator-fill" />
                    <div className="indicator-cycle" />
                  </>
                )}
              </div>
              <div className="item-info">
                <div className="item-name">
                  <div className="item-name-top">
                    <div title={p.name}>{p.name}</div>
                  </div>
                  <div className="item-name-bottom" title={p.url}>
                    <span className="domain-text">{remote ? parseDomain(p.url) : 'Local'}</span>
                    <span className="item-time">({fmtDateTime(p.updatedAt)})</span>
                  </div>
                  {p.total ? (
                    <div className="item-subinfo">
                      <div className="item-subinfo-texts">
                        <div>{fmtBytes(p.used)} / {fmtBytes(p.total)}</div>
                      </div>
                      <div className="progress">
                        <div className="percent" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="item-actions">
                  {remote ? (
                    <Hint
                      className="item-icon"
                      hint="Update"
                      onClick={(e) => {
                        e.stopPropagation()
                        onUpdate(p)
                      }}
                    >
                      <span className={`material-icons${updatingId === p.id ? ' rotating' : ''}`}>
                        refresh
                      </span>
                    </Hint>
                  ) : (
                    <Hint
                      className="item-icon"
                      hint="Edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditing({ ...p, name: p.name, url: p.url })
                      }}
                    >
                      <span className="material-icons">code</span>
                    </Hint>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {Array.from({ length: 20 }, (_, i) => (
          <i key={`hidden${i}`} />
        ))}
        {profiles.length === 0 && <div className="empty-tip">{t('No Profiles')}</div>}
      </div>

      {menu && (
        <div
          ref={menuRef}
          className="ctx-menu"
          style={{ left: menu.x, top: menu.y }}
        >
          {buildMenu(t)
            .filter((m) => !m.hide && !(m.hideWhenLocal && !menu.profile.url))
            .map((m) => (
              <div key={m.text} className="ctx-item" onClick={() => onMenuAction(m, menu.profile)}>
                <span className="material-icons">{m.icon}</span>
                <span>{m.text}</span>
              </div>
            ))}
        </div>
      )}

      {editing && (
        <div className="mask" onMouseDown={() => setEditing(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-title">Edit</div>
            <div className="modal-body">
              <label className="edit-field">
                <span>{t('Name')}</span>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </label>
              <label className="edit-field">
                <span>URL</span>
                <input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={() => setEditing(null)}>
                {t('Cancel')}
              </button>
              <button type="button" className="btn primary" onClick={saveEdit}>
                {t('Save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
