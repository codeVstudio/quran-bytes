import type { Direction, LayoutType, Mode, NavMode } from '@/@types/theme'

export const DIR_RTL: Direction = 'rtl'
export const DIR_LTR: Direction = 'ltr'
export const MODE_LIGHT: Mode = 'light'
export const MODE_DARK: Mode = 'dark'

export const LAYOUT_TYPE_BLANK: LayoutType = 'blank'
export const LAYOUT_TYPE_CLASSIC: LayoutType = 'classic'
export const LAYOUT_TYPE_MODERN: LayoutType = 'modern'

export const NAV_MODE_LIGHT: NavMode = 'light'
export const NAV_MODE_DARK: NavMode = 'dark'
export const NAV_MODE_THEMED: NavMode = 'themed'
export const NAV_MODE_TRANSPARENT: NavMode = 'transparent'

export const THEME_ENUM = {
  DIR_RTL,
  DIR_LTR,
  MODE_LIGHT,
  MODE_DARK,
  LAYOUT_TYPE_BLANK,
  LAYOUT_TYPE_CLASSIC,
  LAYOUT_TYPE_MODERN,
  NAV_MODE_LIGHT,
  NAV_MODE_DARK,
  NAV_MODE_THEMED,
  NAV_MODE_TRANSPARENT,
} as const
