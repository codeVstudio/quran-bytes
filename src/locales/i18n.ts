import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import appConfig from '@/configs/app.config'
import ar from './lang/ar'
import en from './lang/en'

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: appConfig.locale,
  lng: appConfig.locale,
  interpolation: {
    escapeValue: false,
  },
})

export const dateLocales: Record<string, () => Promise<unknown>> = {
  en: () => import('dayjs/locale/en'),
  ar: () => import('dayjs/locale/ar'),
}

export default i18n
