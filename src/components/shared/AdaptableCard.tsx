import type { CommonProps } from '@/@types/common'
import { cn } from '@/utils/classNames'

export interface AdaptableCardProps extends CommonProps {
  bordered?: boolean
}

export function AdaptableCard({ className, bordered = true, children }: AdaptableCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-ivory/90 p-6 transition-colors',
        bordered && 'border border-hairline',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default AdaptableCard
