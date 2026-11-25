export type NavItemType = 'title' | 'collapse' | 'item' | 'anchor'

export interface NavigationTree {
  key: string
  path: string
  isExternalLink?: boolean
  translateKey: string
  title: string
  icon: string
  type: NavItemType
  authority: string[]
  subMenu: NavigationTree[]
}
