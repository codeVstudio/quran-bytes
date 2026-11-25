import { useEffect, type ComponentType } from 'react'
import type { Meta } from '@/@types/routes'
import { useAppDispatch } from '@/store/hook'
import { setCurrentRouteKey } from '@/store/slices/base/commonSlice'

export interface AppRouteProps<T = Record<string, unknown>> {
  component: ComponentType<T>
  routeKey: string
  meta?: Meta
}

export function AppRoute<T extends Record<string, unknown>>({
  component: Component,
  routeKey,
  ...props
}: AppRouteProps<T>) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setCurrentRouteKey(routeKey))
  }, [dispatch, routeKey])

  return <Component {...(props as unknown as T)} />
}

export default AppRoute
