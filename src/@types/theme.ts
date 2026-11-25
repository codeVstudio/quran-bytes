export type Mode = 'light' | 'dark'
export type Direction = 'ltr' | 'rtl'
export type NavMode = 'transparent' | 'light' | 'dark' | 'themed'
export type ControlSize = 'lg' | 'md' | 'sm'
export type LayoutType = 'blank' | 'classic' | 'modern'

export interface ThemeState {
  themeColor: string
  direction: Direction
  mode: Mode
  primaryColorLevel: number
  panelExpand: boolean
  navMode: NavMode
  controlSize: ControlSize
  cardBordered: boolean
  layout: {
    type: LayoutType
    sideNavCollapse: boolean
    previousType?: LayoutType
  }
}
