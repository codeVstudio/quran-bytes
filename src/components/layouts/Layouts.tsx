import { lazy, Suspense, useMemo, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react'
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
