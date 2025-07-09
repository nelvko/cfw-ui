import { i18n } from '@/plugins/i18n/index.js'

const { locale } = i18n.global

export function switchLanguage() {
  if (locale.value === 'cn') {
    locale.value = 'en'
  } else locale.value = 'cn'
}
