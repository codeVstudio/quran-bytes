import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import HomeView from '@/views/home/HomeView'

const publicRoutes: Routes = [
  {
    key: 'home',
    path: '/',
    component: HomeView,
    authority: [],
  },
  {
    key: 'welcome',
    path: '/welcome',
    component: lazy(() => import('@/views/pages/Welcome/Welcome')),
    authority: [],
  },
  {
    key: 'accessDenied',
    path: '/access-denied',
    component: lazy(() => import('@/views/pages/AccessDenied/AccessDenied')),
    authority: [],
  },
]

export default publicRoutes
