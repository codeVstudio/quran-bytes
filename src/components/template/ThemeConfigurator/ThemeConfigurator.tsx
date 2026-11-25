import {
  LAYOUT_TYPE_BLANK,
  LAYOUT_TYPE_CLASSIC,
  LAYOUT_TYPE_MODERN,
} from '@/constants/theme.constant'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setLayout } from '@/store/slices/theme/themeSlice'
import useDarkMode from '@/utils/hooks/useDarkMode'
import LanguageSelector from '../LanguageSelector'

export function ThemeConfigurator() {
  const dispatch = useAppDispatch()
  const layoutType = useAppSelector((state) => state.theme.layout.type)
  const [isDark, setDarkMode] = useDarkMode()

  return (
    <div className="space-y-4 rounded-lg border border-hairline bg-ivory p-4 text-xs text-ink">
      <div>
        <p className="mb-2 font-semibold uppercase tracking-wider text-muted">Mode</p>
        <button
          type="button"
          onClick={() => setDarkMode(!isDark)}
          className="rounded border border-hairline px-3 py-1.5 font-medium"
        >
          {isDark ? 'Light Theme' : 'Dark Theme'}
        </button>
      </div>
      <div>
        <p className="mb-2 font-semibold uppercase tracking-wider text-muted">Layout</p>
        <div className="flex flex-wrap gap-2">
          {[LAYOUT_TYPE_BLANK, LAYOUT_TYPE_CLASSIC, LAYOUT_TYPE_MODERN].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => dispatch(setLayout(type))}
              className="rounded border border-hairline px-2.5 py-1 capitalize"
              aria-pressed={layoutType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-semibold uppercase tracking-wider text-muted">Language</p>
        <LanguageSelector />
      </div>
    </div>
  )
}

export default ThemeConfigurator
