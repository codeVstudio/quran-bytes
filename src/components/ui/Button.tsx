import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/classNames'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'action' | 'ghost'
}

export function Button({
  variant = 'ghost',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const variantClass =
    variant === 'solid'
      ? 'solid-button'
      : variant === 'action'
        ? 'text-action magnetic'
        : undefined

  return (
    <button type={type} className={cn(variantClass, className)} {...rest}>
      {children}
    </button>
  )
}

export default Button
