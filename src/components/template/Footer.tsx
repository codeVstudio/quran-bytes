import SvgIcon from '@/components/shared/SvgIcon'
import {
  BRAND_CREDIT_NAME,
  BRAND_CREDIT_URL,
  COPYRIGHT_YEAR,
} from '@/constants/app.constant'

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="footer-wordmark" href="#top">
        quran <i>bytes</i>.
      </a>
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
      <a className="back-top label" href="#top">
        Back to top <SvgIcon name="icon-arrow-up" />
      </a>
    </footer>
  )
}

export default Footer
