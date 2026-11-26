import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
  {
    key: 'home',
    path: '/',
    title: 'Home',
    translateKey: 'nav.home',
    icon: 'home',
    type: 'item',
    authority: [],
    subMenu: [],
  },
  {
    key: 'getStarted',
    path: '/get-started',
    title: 'Explore',
    translateKey: 'nav.explore',
    icon: 'explore',
    type: 'item',
    authority: [],
    subMenu: [],
  },
  {
    key: 'read',
    path: '/read',
    title: 'Read Quran',
    translateKey: 'nav.read',
    icon: 'explore',
    type: 'item',
    authority: [],
    subMenu: [],
  },
  {
    key: 'practice',
    path: '/dua-hadith',
    title: 'Dua & Hadith',
    translateKey: 'nav.practice',
    icon: 'practice',
    type: 'item',
    authority: [],
    subMenu: [],
  },
]

export default navigationConfig
