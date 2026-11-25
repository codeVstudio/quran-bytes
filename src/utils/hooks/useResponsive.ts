import { useEffect, useState } from 'react'

export interface ResponsiveState {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isPortraitPhone: boolean
}

const getSnapshot = (): ResponsiveState => {
  if (typeof window === 'undefined') {
    return {
      width: 1440,
      height: 900,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isPortraitPhone: false,
    }
  }
  const width = window.innerWidth
  const height = window.innerHeight
  return {
    width,
    height,
    isMobile: width < 600,
    isTablet: width >= 600 && width < 1000,
    isDesktop: width >= 1000,
    isPortraitPhone: width < 600 && height > 560,
  }
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(getSnapshot)

  useEffect(() => {
    const update = () => setState(getSnapshot())
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('orientationchange', update, { passive: true })
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return state
}

export default useResponsive
