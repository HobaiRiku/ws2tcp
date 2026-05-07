import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

export type LocaleKey = 'zh' | 'en'

const STORAGE_KEY = 'ws2tcp.locale'
const supported: LocaleKey[] = ['zh', 'en']

function detectLocale(): LocaleKey {
  const stored = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as LocaleKey | null
  if (stored && supported.includes(stored)) return stored
  const nav = (typeof navigator !== 'undefined' && navigator.language) || ''
  if (nav.toLowerCase().startsWith('en')) return 'en'
  return 'zh'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: detectLocale(),
  fallbackLocale: 'zh',
  messages: { zh, en }
})

export function setLocale(locale: LocaleKey) {
  i18n.global.locale.value = locale
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale)
  }
}

export function currentLocale(): LocaleKey {
  return i18n.global.locale.value as LocaleKey
}

export const localeOptions: { value: LocaleKey; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'EN' }
]
