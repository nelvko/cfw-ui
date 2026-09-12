import { useEffect, useState } from 'react'
import { useSettings } from '../store/settings'
import { useClash } from '../store/clash'

// 与原版 computed.titleText 一致:settings.titleBarText 的占位符替换
function useTitleText() {
  const raw = useSettings((s) => s.titleBarText)
  const mode = useClash((s) => s.mode)
  const tunMode = useSettings((s) => s.tunMode)
  const systemProxy = useSettings((s) => s.systemProxy)
  const mixin = useSettings((s) => s.mixin)

  if (!raw) return ''
  const capMode = mode ? mode[0].toUpperCase() + mode.slice(1) : ''
  return raw
    .replace('%mode%', mode)
    .replace('%Mode%', capMode)
    .replace('%tun%', tunMode ? 'On' : 'Off')
    .replace('%systemProxy%', systemProxy ? 'On' : 'Off')
    .replace('%mixin%', mixin ? 'On' : 'Off')
    .replace(/%tun\?(.+?):(.+?)%/, tunMode ? '$1' : '$2')
    .replace(/%systemProxy\?(.+?):(.+?)%/, systemProxy ? '$1' : '$2')
    .replace(/%mixin\?(.+?):(.+?)%/, mixin ? '$1' : '$2')
}

export default function StatusBar() {
  const titleText = useTitleText()
  // 原版由 Electron 的 window-event 驱动;Web 版改用浏览器全屏状态
  const [isFullScreen, setIsFullScreen] = useState(() => !!document.fullscreenElement)

  useEffect(() => {
    const onChange = () => setIsFullScreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // 原版 maxApp:全屏时退出,否则在 maximize/unmaximize 间切换
  const maxApp = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
  }

  return (
    <div className="status-bar">
      <div className="empty">
        <div className="bottom"></div>
      </div>
      <span className="status-title">{titleText}</span>
      {!isFullScreen && (
        <div className="close">
          <span className="material-icons">push_pin</span>
        </div>
      )}
      {!isFullScreen && (
        <div className="close">
          <span className="material-icons icon-minimize">minimize</span>
        </div>
      )}
      <div className="close" onClick={maxApp}>
        <span className="material-icons">
          {isFullScreen ? 'close_fullscreen' : 'check_box_outline_blank'}
        </span>
      </div>
      {!isFullScreen && (
        <div className="close status-close" onClick={() => window.close()}>
          <span className="material-icons">close</span>
        </div>
      )}
    </div>
  )
}
