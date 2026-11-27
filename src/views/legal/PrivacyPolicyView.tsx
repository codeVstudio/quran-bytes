import { Link } from 'react-router-dom'
import { BRAND_CREDIT_NAME, BRAND_CREDIT_URL } from '@/constants/app.constant'
import LegalShell from './components/LegalShell'

export function PrivacyPolicyView() {
  return (
    <LegalShell
      kicker="Legal · Privacy"
      title={
        <>
          Privacy <em>Policy.</em>
        </>
      }
      summary="Quran Bytes is built for distraction-free Islamic learning without advertising, behavioral tracking, or data brokering."
    >
      <section className="legal-section">
        <h2>1. Overview & Commitment</h2>
        <p>
          Quran Bytes is an independent, open-source platform dedicated to reading, reflecting upon,
          and learning from the Holy Qur’an and authentic Sunnah sources. We respect your privacy and
          intentionally keep data collection to the strict minimum required for the interface to
          function cleanly.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Information Stored on Your Device</h2>
        <p>
          Unless a dedicated backend API is configured for your deployment, account sign-up details,
          login sessions, bookmarked ayahs, saved Dua & Hadith entries, translation choices, and
          display preferences are stored locally in your browser using <code>localStorage</code> and
          essential functional cookies.
        </p>
        <ul>
          <li>
            <strong>Local account credentials:</strong> Passwords created in the browser-local login
            flow are salted and hashed using Web Crypto SHA-256 on your device before saving to
            local storage.
          </li>
          <li>
            <strong>Study preferences:</strong> Your chosen Arabic font size, selected Surah or
            translation edition, and saved verses stay inside your own browser storage.
          </li>
          <li>
            <strong>Consent state:</strong> Your cookie consent decision (<code>Accept All</code>{' '}
            or <code>Essential Only</code>) is saved locally so the banner does not repeatedly
            interrupt your reading.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. External Requests & Third-Party Services</h2>
        <p>
          To provide live Qur’anic Arabic script, translations, keyword verse search, and audio
          recitation, the reader fetches public scriptural data directly from the Al-Quran Cloud API
          (<code>api.alquran.cloud</code>). Fonts and hosting infrastructure (such as Vercel and
          Google Fonts) may receive standard HTTP request headers (such as your IP address and user
          agent) as part of normal web delivery.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. No Advertising or Commercial Tracking</h2>
        <p>
          Quran Bytes does not display third-party ads, sell user information, run behavioral ad
          networks, or share your reading activity with marketers.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Your Controls & Data Removal</h2>
        <p>
          You can sign out at any time from the top navigation bar, clear your browser site data /
          <code>localStorage</code> to remove all locally saved bookmarks and accounts, or update
          your cookie preferences directly on our{' '}
          <Link to="/cookie-policy">Cookie Policy</Link> page.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Contact</h2>
        <p>
          Questions or privacy requests regarding Quran Bytes can be directed to the project
          maintainers via{' '}
          <a href={BRAND_CREDIT_URL} target="_blank" rel="noopener noreferrer">
            {BRAND_CREDIT_NAME}
          </a>
          .
        </p>
      </section>
    </LegalShell>
  )
}

export default PrivacyPolicyView
