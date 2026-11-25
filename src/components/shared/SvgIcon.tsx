import { cn } from '@/utils/classNames'

export interface SvgIconProps {
  name: string
  className?: string
}

export function SvgIcon({ name, className }: SvgIconProps) {
  return (
    <svg className={cn('icon', className)} aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  )
}

export default SvgIcon
