import type { ReactNode } from 'react'
import Footer from '@/components/template/Footer'
import { cn } from '@/utils/classNames'

export interface SubpageLayoutProps {
  shellClassName?: string
  containerClassName?: string
  children: ReactNode
}

export function SubpageLayout({
  shellClassName,
  containerClassName,
  children,
}: SubpageLayoutProps) {
  return (
    <div className="subpage-page">
      <main id="main" className={cn('subpage-shell', shellClassName)}>
        <div className={cn('subpage-container', containerClassName)}>
          {children}
        </div>
      </main>
      <div className="subpage-footer-band">
        <div className="subpage-container">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default SubpageLayout
