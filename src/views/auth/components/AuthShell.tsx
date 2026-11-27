import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Footer from '@/components/template/Footer'

export interface AuthShellProps {
  kicker: string
  title: ReactNode
  subtitle: string
  children: ReactNode
}

export function AuthShell({ kicker, title, subtitle, children }: AuthShellProps) {
  return (
    <main id="main" className="subpage-shell auth-shell">
      <div className="subpage-container auth-container">
        <nav className="subpage-breadcrumb" aria-label="Back navigation">
          <Link to="/" className="back-link">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
        </nav>

        <section className="auth-card" aria-labelledby="auth-heading">
          <svg className="auth-card-star" viewBox="0 0 40 40" aria-hidden="true">
            <use href="#icon-star" />
          </svg>
          <p className="label subpage-kicker">{kicker}</p>
          <h1 id="auth-heading" className="auth-title">
            {title}
          </h1>
          <p className="auth-subtitle">{subtitle}</p>

          {children}
        </section>
      </div>

      <div className="subpage-container">
        <Footer />
      </div>
    </main>
  )
}

export default AuthShell
