import { Link, useLocation } from 'react-router-dom'
import {
  APP_NAME,
  BRAND_CREDIT_NAME,
  BRAND_CREDIT_URL,
  COPYRIGHT_YEAR,
} from '@/constants/app.constant'

interface FooterLinkItem {
  label: string
  to: string
}

interface FooterColumn {
  title: string
  links: FooterLinkItem[]
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { label: 'Read Quran', to: '/read' },
      { label: 'Translations', to: '/translation' },
      { label: 'Duas', to: '/dua-hadith?category=dua' },
      { label: 'Hadith', to: '/dua-hadith?category=hadith' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'AI Islamic Assistant', to: '/assistant' },
      { label: 'About Us', to: '/about' },
      { label: 'Our Vision', to: '/vision' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal & Information',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
    ],
  },
]

export function Footer() {
  const { pathname, hash } = useLocation()
  const isHomeTop = pathname === '/' && !hash

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link
            className="footer-wordmark"
            to="/"
            onClick={(e) => {
              if (isHomeTop) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
          >
            quran <i>bytes</i>.
          </Link>
          <p className="footer-desc">
            A beautiful space to read, understand and connect with the Quran.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav
            key={column.title}
            className="footer-col"
            aria-label={column.title}
          >
            <h2 className="footer-heading">{column.title}</h2>
            <ul className="footer-links">
              {column.links.map((item) => (
                <li key={item.to}>
                  <Link className="footer-link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer-copyright-bar">
        <p className="footer-copyright">
          &copy; {COPYRIGHT_YEAR} {APP_NAME}. Built with care by{' '}
          <a
            className="footer-credit-link"
            href={BRAND_CREDIT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {BRAND_CREDIT_NAME}
          </a>
          .
        </p>
      </div>
    </footer>
  )
}

export default Footer
