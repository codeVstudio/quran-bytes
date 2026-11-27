import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COOKIE_CONSENT_EVENT,
  getCookieConsent,
  setCookieConsent,
  type CookieConsentLevel,
} from '@/utils/cookieConsent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getCookieConsent()) {
      setVisible(false)
      return
    }

    const reveal = () => {
      if (!getCookieConsent()) {
        setVisible(true)
      }
    }

    const root = document.documentElement
    if (!root.classList.contains('is-intro-active')) {
      const timer = window.setTimeout(reveal, 180)
      return () => window.clearTimeout(timer)
    }

    const handleIntroDone = () => reveal()
    document.addEventListener('qb:intro-complete', handleIntroDone, { once: true })
    const safetyTimer = window.setTimeout(reveal, 2400)

    return () => {
      document.removeEventListener('qb:intro-complete', handleIntroDone)
      window.clearTimeout(safetyTimer)
    }
  }, [])

  useEffect(() => {
    const syncConsent = () => {
      setVisible(!getCookieConsent())
    }
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent)
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent)
  }, [])

  if (!visible) return null

  const handleChoice = (level: CookieConsentLevel) => {
    setCookieConsent(level)
    setVisible(false)
  }

  return (
    <aside
      className="cookie-banner"
      id="cookie-banner"
      role="region"
      aria-label="Cookie consent"
    >
      <div className="cookie-banner-copy">
        <span className="label cookie-banner-kicker">Cookies & Privacy</span>
        <p>
          We use essential cookies and browser storage to remember your bookmarks, reading
          preferences, and consent choice. Read our{' '}
          <Link to="/cookie-policy">Cookie Policy</Link> and{' '}
          <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <button
          type="button"
          className="cookie-btn-secondary"
          id="cookie-essential-only"
          onClick={() => handleChoice('essential')}
        >
          Essential Only
        </button>
        <button
          type="button"
          className="cookie-btn-primary"
          id="cookie-accept-all"
          onClick={() => handleChoice('all')}
        >
          Accept All
        </button>
      </div>
    </aside>
  )
}

export default CookieBanner
