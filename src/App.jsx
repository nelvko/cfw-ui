import { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import StatusBar from './components/StatusBar'
import { useSettings } from './store/settings'
import { bootstrap, startLive, stopLive } from './service'
import General from './pages/General'
import Proxies from './pages/Proxies'
import Profiles from './pages/Profiles'
import Logs from './pages/Logs'
import Connections from './pages/Connections'
import Rules from './pages/Rules'
import SettingsPage from './pages/Settings'
import Feedback from './pages/Feedback'

const PAGES = {
  general: General,
  proxies: Proxies,
  profiles: Profiles,
  logs: Logs,
  connections: Connections,
  rules: Rules,
  settings: SettingsPage,
  feedback: Feedback,
}

// 与原版一致:2077 主题显示赛博朋克云图,red 主题显示国庆中秋图
const THEME_BG = {
  '2077': '/imgs/2077.png',
  red: '/imgs/national_day.png',
}

export default function App() {
  const activePage = useSettings((s) => s.activePage)
  const theme = useSettings((s) => s.theme)
  const systemTheme = useSettings((s) => s.systemTheme)
  const demoMode = useSettings((s) => s.demoMode)
  const backend = useSettings((s) => s.backend)
  const fontFamily = useSettings((s) => s.fontFamily)
  const useSystemEmoji = useSettings((s) => s.useSystemEmoji)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      // 原版 getter:systemTheme 开启时仅 dark/light 跟随系统
      const t = systemTheme ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = t
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme, systemTheme])

  useEffect(() => {
    // 原版 action setFont: 自定义字体名 + 内置字体栈 (+ TwemojiMozilla)
    const custom = (fontFamily || '')
      .split(',')
      .map((x) => `"${x.trim().replace(/^"|"$/g, '')}"`)
      .filter((x) => x !== '""')
    const base = [...custom, '"Microsoft Yahei"', '"PingFang SC"', '"system-ui"', '微软雅黑'].join(', ')
    document.body.style.fontFamily = useSystemEmoji ? base : base + ', "TwemojiMozilla"'
  }, [fontFamily, useSystemEmoji])

  useEffect(() => {
    let cancelled = false
    // 防抖:后端地址逐字输入时不至于每字符重建一次 WS
    const timer = setTimeout(() => {
      bootstrap().then(() => {
        if (!cancelled) startLive()
      })
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
      stopLive()
    }
  }, [demoMode, backend.host, backend.port, backend.secret])

  const Page = PAGES[activePage] ?? General
  const bg = !systemTheme && THEME_BG[theme]

  return (
    <div className="app">
      {bg && <img className="cloud opacicy" src={bg} alt="" />}
      <StatusBar />
      <div className="app-body">
        <Sidebar />
        <main className="content">
          <Page />
        </main>
      </div>
    </div>
  )
}
