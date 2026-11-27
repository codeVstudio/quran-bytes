import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '@/components/template/Footer'
import { cn } from '@/utils/classNames'

export interface LegalShellProps {
  kicker: string
  title: ReactNode
  summary: string
  lastUpdated?: string
  children: ReactNode
}

const LEGAL_TABS = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
  { to: '/cookie-policy', label: 'Cookie Policy' },
]

export function LegalShell({
  kicker,
  title,
  summary,
  lastUpdated = 'November 27, 2026',
  children,
}: LegalShellProps) {
  const { pathname } = useLocation()

  return (
    <main id="main" className="subpage-shell legal-shell">
      <div className="subpage-container legal-container">
        <div className="subpage-topbar">
          <Link to="/" className="back-link">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
          <nav className="legal-tab-nav" aria-label="Legal documents">
            {LEGAL_TABS.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn('topic-chip', pathname === tab.to && 'is-active')}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <header className="legal-header">
          <p className="label subpage-kicker">{kicker}</p>
          <h1 className="subpage-title">{title}</h1>
          <p className="subpage-subtitle">{summary}</p>
          <p className="legal-updated">Last updated: {lastUpdated}</p>
        </header>

        <article className="legal-article">{children}</article>
      </div>

      <div className="subpage-container">
        <Footer />
      </div>
    </main>
  )
}

export default LegalShell
