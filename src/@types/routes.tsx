import type { ComponentType, LazyExoticComponent } from 'react'
import type { LayoutType } from './theme'

export interface Meta {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  header?: string | (() => JSX.Element)
  footer?: boolean
  layout?: LayoutType
}

type RouteComponent<T = Record<string, unknown>> =
  | ComponentType<T>
  | LazyExoticComponent<(<U extends T>(props: U) => JSX.Element) | (() => JSX.Element)>

export type Route<T = Record<string, unknown>> = {
  key: string
  path: string
  component: RouteComponent<T>
  authority: string[]
  meta?: Meta
}

export type Routes = Route[]
