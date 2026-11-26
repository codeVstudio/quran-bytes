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
      <p>
        Built by{' '}
        <a
          className="footer-credit-link"
          href={BRAND_CREDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {BRAND_CREDIT_NAME}
        </a>
        <br />
        Copyright &copy; {COPYRIGHT_YEAR}
      </p>
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
