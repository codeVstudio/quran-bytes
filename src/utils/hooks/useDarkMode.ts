import { useEffect } from 'react'
import { MODE_DARK, MODE_LIGHT } from '@/constants/theme.constant'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setMode } from '@/store/slices/theme/themeSlice'

export function useDarkMode(): [boolean, (enabled: boolean) => void] {
  const mode = useAppSelector((state) => state.theme.mode)
  const dispatch = useAppDispatch()
  const isEnabled = mode === MODE_DARK

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(isEnabled ? MODE_LIGHT : MODE_DARK)
    root.classList.add(isEnabled ? MODE_DARK : MODE_LIGHT)
  }, [isEnabled])

  const setDarkMode = (enabled: boolean) => {
    dispatch(setMode(enabled ? MODE_DARK : MODE_LIGHT))
  }

  return [isEnabled, setDarkMode]
}

export default useDarkMode
