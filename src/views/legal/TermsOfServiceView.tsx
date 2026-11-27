import { Link } from 'react-router-dom'
import { BRAND_CREDIT_NAME, BRAND_CREDIT_URL } from '@/constants/app.constant'
import LegalShell from './components/LegalShell'

export function TermsOfServiceView() {
  return (
    <LegalShell
      kicker="Legal · Terms"
      title={
        <>
          Terms of <em>Service.</em>
        </>
      }
      summary="Clear guidelines for respectful educational use of Quran Bytes, scriptural attributions, and platform limitations."
    >
      <section className="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Quran Bytes, you agree to these Terms of Service and our{' '}
          <Link to="/privacy-policy">Privacy Policy</Link>. If you do not agree with these terms,
          please discontinue use of the platform.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Purpose & Respectful Educational Use</h2>
        <p>
          Quran Bytes is provided as a free, open-source digital space for reading the Qur’an,
          reviewing translations, studying authentic Duas and Hadiths, and exploring topic lookups.
          You agree to use the service lawfully and respectfully without attempting to disrupt
          service availability, scrape automated limits abusively, or misrepresent source texts.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Source Texts, Translations & Guided Lookup Disclaimer</h2>
        <ul>
          <li>
            <strong>Qur’an & Translations:</strong> Uthmani Arabic text, recitation audio, and
            translations (including Saheeh International, Abdullah Yusuf Ali, Muhammad Asad,
            Pickthall, and Fateh Muhammad Jalandhry) are retrieved from Al-Quran Cloud and belong to
            their respective translators and publishers.
          </li>
          <li>
            <strong>No Official Religious Rulings (Fatwa):</strong> The guided lookup / assistant
            feature searches curated references and scriptural keywords for study purposes only. It
            does not issue personalized Islamic legal verdicts (fatwa); always consult qualified
            scholars for personal religious, legal, or family matters.
          </li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Open-Source Software & Availability</h2>
        <p>
          Quran Bytes software components built by{' '}
          <a href={BRAND_CREDIT_URL} target="_blank" rel="noopener noreferrer">
            {BRAND_CREDIT_NAME}
          </a>{' '}
          are provided on an “as is” and “as available” basis without warranties of uninterrupted
          uptime, error-free third-party API responses, or fitness for a particular commercial
          purpose.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Modifications to Service & Terms</h2>
        <p>
          We may update features, planned previews, or these Terms from time to time as Quran Bytes
          evolves. Continued use of the website after updates take effect constitutes acceptance of
          the revised Terms.
        </p>
      </section>
    </LegalShell>
  )
}

export default TermsOfServiceView
