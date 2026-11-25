import i18n from '@/locales/i18n'
import { DIR_LTR, DIR_RTL } from '@/constants/theme.constant'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setDirection } from '@/store/slices/theme/themeSlice'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', dir: DIR_LTR },
  { value: 'ar', label: 'العربية', dir: DIR_RTL },
] as const

export function LanguageSelector() {
  const dispatch = useAppDispatch()
  const direction = useAppSelector((state) => state.theme.direction)

  const handleChange = (lang: 'en' | 'ar') => {
    const selected = LANGUAGE_OPTIONS.find((item) => item.value === lang)
    if (!selected) return
    void i18n.changeLanguage(selected.value)
    dispatch(setDirection(selected.dir))
  }

  return (
    <div className="inline-flex items-center gap-2 text-xs">
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleChange(option.value)}
          className="rounded border border-hairline px-2 py-1 text-xs font-medium text-emerald-deep"
          aria-pressed={(direction === DIR_RTL ? 'ar' : 'en') === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default LanguageSelector
