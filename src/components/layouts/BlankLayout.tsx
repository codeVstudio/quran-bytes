import type { ReactNode } from 'react'
import Header from '@/components/template/Header'
import SiteHelpWidget from '@/components/template/SiteHelpWidget'

export interface BlankLayoutProps {
  children: ReactNode
}

export function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      {children}
      <SiteHelpWidget />
    </>
  )
}

export default BlankLayout
