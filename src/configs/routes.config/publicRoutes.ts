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
    key: 'getStarted',
    path: '/get-started',
    component: lazy(() => import('@/views/getStarted/GetStartedView')),
    authority: [],
  },
  {
    key: 'readQuran',
    path: '/read',
    component: lazy(() => import('@/views/read/ReadQuranView')),
    authority: [],
  },
  {
    key: 'quranTranslation',
    path: '/translation',
    component: lazy(() => import('@/views/understand/QuranTranslationView')),
    authority: [],
  },
  {
    key: 'duaHadith',
    path: '/dua-hadith',
    component: lazy(() => import('@/views/practice/DuaHadithView')),
    authority: [],
  },
  {
    key: 'assistant',
    path: '/assistant',
    component: lazy(() => import('@/views/assistant/AssistantView')),
    authority: [],
  },
  {
    key: 'login',
    path: '/login',
    component: lazy(() => import('@/views/auth/Login/LoginView')),
    authority: [],
  },
  {
    key: 'signup',
    path: '/signup',
    component: lazy(() => import('@/views/auth/SignUp/SignUpView')),
    authority: [],
  },
  {
    key: 'forgotPassword',
    path: '/forgot-password',
    component: lazy(() => import('@/views/auth/ForgotPassword/ForgotPasswordView')),
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
