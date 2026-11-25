import type { ElementType } from 'react'
import type { CommonProps } from '@/@types/common'
import { cn } from '@/utils/classNames'

export interface ContainerProps extends CommonProps {
  as?: ElementType
}

export function Container({ as: Component = 'div', className, children }: ContainerProps) {
  return (
    <Component className={cn('mx-auto w-full max-w-[1320px] px-4 sm:px-6', className)}>
      {children}
    </Component>
  )
}

export default Container
