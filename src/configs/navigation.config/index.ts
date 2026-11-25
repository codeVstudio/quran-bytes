import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
  {
    key: 'vision',
    path: '#vision',
    title: 'Vision',
    translateKey: 'nav.vision',
    icon: 'vision',
    type: 'anchor',
    authority: [],
    subMenu: [],
  },
  {
    key: 'explore',
    path: '#explore',
    title: 'Explore',
    translateKey: 'nav.explore',
    icon: 'explore',
    type: 'anchor',
    authority: [],
    subMenu: [],
  },
  {
    key: 'getInvolved',
    path: '#get-involved',
    title: 'Get involved',
    translateKey: 'nav.getInvolved',
    icon: 'getInvolved',
    type: 'anchor',
    authority: [],
    subMenu: [],
  },
]

export default navigationConfig
