import { lazy, Suspense, useEffect, useMemo, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import { useAppSelector } from '@/store/hook'
import Views from '@/views/Views'
import BlankLayout from './BlankLayout'

type LayoutComponent =
  | ComponentType<{ children: ReactNode }>
  | LazyExoticComponent<ComponentType<{ children: ReactNode }>>

const layouts: Record<LayoutType, LayoutComponent> = {
  blank: BlankLayout,
  classic: lazy(() => import('./ClassicLayout')),
  modern: lazy(() => import('./ModernLayout')),
}

export function Layouts() {
  const layoutType = useAppSelector((state) => state.theme.layout.type)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  const AppLayout = useMemo(() => layouts[layoutType] ?? layouts.blank, [layoutType])

  return (
    <Suspense fallback={null}>
      <AppLayout>
        <Views />
      </AppLayout>
    </Suspense>
  )
}

export default Layouts
