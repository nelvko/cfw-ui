import { create } from 'zustand'

// 运行时状态:来自 clash 内核的实时数据,不持久化
let logSeq = 0

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
      // 原版日志行 key 用唯一 id; 这里在入队时分配, 保证渲染与展开状态稳定
      return { logs: [...logs, { ...entry, id: entry.id ?? `${entry.ts}-${++logSeq}` }] }
    }),
  clearLogs: () => set({ logs: [] }),
}))
