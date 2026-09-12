import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettings = create(
  persist(
    (set) => ({
      // 界面
      activePage: 'general',
      theme: 'light',
      // 原版 MENU_ITEM_ORDER: 侧栏菜单自定义顺序(空数组=默认顺序)
      menuOrder: [],
      systemTheme: false,
      fontFamily: '',
      useSystemEmoji: false,
      titleBarText: '',
      lang: 'zh',
      // 后端
      demoMode: true,
      backend: { host: '127.0.0.1', port: '9090', secret: '' },
      // General 开关与端口
      systemProxy: false,
      tunMode: false,
      mixin: false,
      allowLan: false,
      ipv6: false,
      autoLaunch: false,
      randomMixedPort: false,
      ports: { mixed: '7890' },
      // 日志 / 延迟测试
      logLevel: 'info',
      testUrl: 'https://www.gstatic.com/generate_204',
      testTimeout: 5000,
      // Proxies(原版 showProxyFilter 默认关闭, 右下角不显示关键词过滤图标)
      showProxyFilter: false,
      // Proxies(原版: proxyItemWidth <150 回退 290px; miniListWidth=0 隐藏右侧导航条)
      proxyItemWidth: '290',
      proxyMiniListWidth: '100',
      // Proxies(原版 PROXY_SHOW_SEC_IDXS: 显示"滚动到选中节点"图标的组下标)
      proxyShowSecIdxs: [],
      // Connections(原版 settings.connChainType 默认 0=Proxy; connShowProcess 默认关)
      connChainType: 0,
      connShowProcess: false,
      // 订阅(演示模式下本地保存)
      profiles: [],
      activeProfileId: null,
      profilesSeeded: false,

      setActivePage: (activePage) => set({ activePage }),
      patch: (obj) => set(obj),
      patchBackend: (obj) => set((s) => ({ backend: { ...s.backend, ...obj } })),
      patchPorts: (obj) => set((s) => ({ ports: { ...s.ports, ...obj } })),
      addProfile: (p) => set((s) => ({ profiles: [...s.profiles, p] })),
      removeProfile: (id) =>
        set((s) => ({
          profiles: s.profiles.filter((x) => x.id !== id),
          activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        })),
      updateProfile: (id, obj) =>
        set((s) => ({ profiles: s.profiles.map((x) => (x.id === id ? { ...x, ...obj } : x)) })),
      setActiveProfile: (activeProfileId) => set({ activeProfileId }),
      reset: () =>
        set({
          activePage: 'general',
          theme: 'light',
          menuOrder: [],
          systemTheme: false,
          fontFamily: '',
          useSystemEmoji: false,
          titleBarText: '',
          lang: 'zh',
          demoMode: true,
          backend: { host: '127.0.0.1', port: '9090', secret: '' },
          systemProxy: false,
          tunMode: false,
          mixin: false,
          allowLan: false,
          ipv6: false,
          autoLaunch: false,
          randomMixedPort: false,
          ports: { mixed: '7890' },
          logLevel: 'info',
          testUrl: 'https://www.gstatic.com/generate_204',
          testTimeout: 5000,
          showProxyFilter: false,
          proxyItemWidth: '290',
          proxyMiniListWidth: '100',
          proxyShowSecIdxs: [],
          connChainType: 0,
          connShowProcess: false,
          profiles: [],
          activeProfileId: null,
          profilesSeeded: false,
        }),
    }),
    { name: 'clash-for-web' },
  ),
)
