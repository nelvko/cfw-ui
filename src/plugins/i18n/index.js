import { createI18n } from 'vue-i18n'
import cn from './cn.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    cn,
  },
  // ✅ 关闭控制台警告
  missingWarn: false,
  fallbackWarn: false,

  // ✅ 启用 fallback 返回 key
  fallbackFormat: true,
  returnNull: false,

  // ✅ 可选：手动返回 key
  missing(locale, key) {
    return key
  },
})
