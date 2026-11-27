import { useState } from 'react'
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsentLevel,
} from '@/utils/cookieConsent'
import LegalShell from './components/LegalShell'

export function CookiePolicyView() {
  const [consent, setConsent] = useState(() => getCookieConsent())
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleUpdate = (level: CookieConsentLevel) => {
    const next = setCookieConsent(level)
    setConsent(next)
    setFeedback(
      level === 'all'
        ? 'All essential and preference cookies are now enabled.'
        : 'Saved preference: only strictly essential storage is enabled.',
    )
  }

  return (
    <LegalShell
      kicker="Legal · Cookies"
      title={
        <>
          Cookie <em>Policy.</em>
        </>
      }
      summary="How Quran Bytes uses essential browser storage and preference cookies — with zero third-party ad or tracking cookies."
    >
      <section className="legal-section">
        <h2>1. What Are Cookies & Browser Storage?</h2>
        <p>
          Cookies and browser storage (<code>localStorage</code>) are small pieces of data saved by
          your web browser to remember session state, consent choices, and study preferences between
          page visits.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Categories We Use</h2>
        <ul>
          <li>
            <strong>Strictly Essential Storage:</strong> Required for core functionality such as
            recording your cookie consent banner choice (<code>qb_consent</code> /{' '}
            <code>qb_cookie_consent_v1</code>) and keeping your active session state intact across
            reloads.
          </li>
          <li>
            <strong>Functional & Study Preferences:</strong> Remembers your saved ayahs, selected
            translation edition, Arabic text size, and saved Dua & Hadith items cleanly on your
            device.
          </li>
          <li>
            <strong>Advertising & Third-Party Tracking Cookies:</strong> None. Quran Bytes does not
            place advertising, retargeting, or cross-site tracking cookies.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. Manage Your Preference</h2>
        <p>
          Current preference:{' '}
          <strong>
            {consent?.level === 'all'
              ? 'All Cookies Accepted'
              : consent?.level === 'essential'
                ? 'Essential Only'
                : 'Not Yet Selected'}
          </strong>
        </p>
        <div className="legal-cookie-controls">
          <button
            type="button"
            className="cookie-btn-primary"
            onClick={() => handleUpdate('all')}
          >
            Accept All Cookies
          </button>
          <button
            type="button"
            className="cookie-btn-secondary"
            onClick={() => handleUpdate('essential')}
          >
            Essential Only
          </button>
        </div>
        {feedback && (
          <p className="legal-consent-feedback" role="status">
            {feedback}
          </p>
        )}
      </section>
    </LegalShell>
  )
}

export default CookiePolicyView
