import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettings = create(
  persist(
    (set) => ({
      // 界面
      activePage: 'general',
      theme: 'light',
      systemTheme: false,
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
      ports: { mixed: '7890' },
      // 日志 / 延迟测试
      logLevel: 'info',
      testUrl: 'https://www.gstatic.com/generate_204',
      testTimeout: 5000,
      // 订阅(演示模式下本地保存)
      profiles: [],
      activeProfileId: null,

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
    }),
    { name: 'clash-for-web' },
  ),
)
