import { create } from 'zustand'

// 运行时状态:来自 clash 内核的实时数据,不持久化
export const useClash = create((set) => ({
  version: '',
  connected: false,
  mode: 'rule',
  proxies: {},
  groupNames: [],
  delays: {},
  testing: false,
  traffic: { up: 0, down: 0 },
  totals: { up: 0, down: 0 },
  logs: [],
  connections: [],

  patch: (obj) => set(obj),
  pushLog: (entry) =>
    set((s) => {
      const logs = s.logs.length >= 1000 ? s.logs.slice(-999) : s.logs
      return { logs: [...logs, entry] }
    }),
  clearLogs: () => set({ logs: [] }),
}))
