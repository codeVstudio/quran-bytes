import type { ReactNode } from 'react'
import Header from '@/components/template/Header'
import SideNav from '@/components/template/SideNav'
import SiteHelpWidget from '@/components/template/SiteHelpWidget'

export interface ClassicLayoutProps {
  children: ReactNode
}

export function ClassicLayout({ children }: ClassicLayoutProps) {
  return (
    <div className="flex min-h-screen bg-ivory">
      <SideNav />
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
      <SiteHelpWidget />
    </div>
  )
}

export default ClassicLayout
