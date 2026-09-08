import { useMemo } from 'react'
import { useSettings } from '../store/settings'
import { makeT } from '../i18n'

export function useT() {
  const lang = useSettings((s) => s.lang)
  return useMemo(() => makeT(lang), [lang])
}
