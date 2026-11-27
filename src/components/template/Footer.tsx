import { Link, useLocation } from 'react-router-dom'
import SvgIcon from '@/components/shared/SvgIcon'
import {
  BRAND_CREDIT_NAME,
  BRAND_CREDIT_URL,
  COPYRIGHT_YEAR,
} from '@/constants/app.constant'

export function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <footer className="site-footer">
      <Link
        className="footer-wordmark"
        to="/"
        onClick={(e) => {
          if (isHome) {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
      >
        quran <i>bytes</i>.
      </Link>
      <div className="site-footer-meta">
        <p>
          Built by{' '}
          <a
            className="footer-credit-link"
            href={BRAND_CREDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {BRAND_CREDIT_NAME}
          </a>{' '}
          · Copyright &copy; {COPYRIGHT_YEAR}
        </p>
        <nav className="footer-legal-nav" aria-label="Legal">
          <span className="footer-legal-label">Legal</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms-of-service">Terms of Service</Link>
          <span aria-hidden="true">·</span>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </nav>
      </div>
      <button
        type="button"
        className="back-top label"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top <SvgIcon name="icon-arrow-up" />
      </button>
    </footer>
  )
}

export default Footer
