import type { ReactNode } from 'react'

export interface CommonProps {
  className?: string
  children?: ReactNode
}

export interface TableQueries {
  total?: number
  pageIndex?: number
  pageSize?: number
  query?: string
  sort?: {
    order: 'asc' | 'desc' | ''
    key: string | number
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface PageMeta {
  title?: string
  subtitle?: string
  description?: string
}
