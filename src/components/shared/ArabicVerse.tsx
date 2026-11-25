import { forwardRef } from 'react'
import { cn } from '@/utils/classNames'

export interface ArabicVerseProps {
  id?: string
  text: string
  className?: string
}

export const ArabicVerse = forwardRef<HTMLParagraphElement, ArabicVerseProps>(
  ({ id, text, className }, ref) => (
    <p ref={ref} id={id} className={cn('arabic verse', className)} lang="ar" dir="rtl">
      {text}
    </p>
  ),
)

ArabicVerse.displayName = 'ArabicVerse'

export default ArabicVerse
