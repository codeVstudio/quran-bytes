import type { ThemeState } from '@/@types/theme'
import { THEME_ENUM } from '@/constants/theme.constant'

export const themeConfig: ThemeState = {
  themeColor: 'emerald',
  direction: THEME_ENUM.DIR_LTR,
  mode: THEME_ENUM.MODE_LIGHT,
  primaryColorLevel: 800,
  cardBordered: false,
  panelExpand: false,
  controlSize: 'md',
  navMode: THEME_ENUM.NAV_MODE_TRANSPARENT,
  layout: {
    type: THEME_ENUM.LAYOUT_TYPE_BLANK,
    sideNavCollapse: false,
  },
}
