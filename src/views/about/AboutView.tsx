import { Link } from 'react-router-dom'
import SubpageLayout from '@/components/layouts/SubpageLayout'
import SvgIcon from '@/components/shared/SvgIcon'

interface ExploreFeature {
  number: string
  title: string
  description: string
  to: string
  cta: string
  icon: JSX.Element
}

interface ApproachPrinciple {
  number: string
  title: string
  description: string
}

const EXPLORE_FEATURES: ExploreFeature[] = [
  {
    number: '01',
    title: 'Quran Reading',
    description: 'Explore the Quran in a comfortable reading experience.',
    to: '/read',
    cta: 'Open Reader',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M14 7.5C11.5 5.8 7.5 5 4 5.5v15.8c3.5-.5 7.5.3 10 2.2 2.5-1.9 6.5-2.7 10-2.2V5.5c-3.5-.5-7.5.3-10 2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M14 7.5v16" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Translations',
    description: 'Understand the meanings of Quranic verses.',
    to: '/translation',
    cta: 'Explore Meanings',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="4" y="4.5" width="12.5" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M16.5 9.5H22a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H11.5a2 2 0 0 1-2-2v-1.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M7.5 10h5.5M7.5 14h4M13.5 17h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Duas & Hadith',
    description: 'Discover supplications and prophetic teachings.',
    to: '/dua-hadith',
    cta: 'Browse Collection',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="m20 3 4.8 4.8H31v6.2L36 19l-5 5v6.2h-6.2L20 35l-4.8-4.8H9V24l-5-5 5-5V7.8h6.2Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="19" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'AI Islamic Assistant',
    description:
      'Explore Islamic questions through an AI-powered experience grounded in reliable Islamic sources.',
    to: '/assistant',
    cta: 'Ask the Assistant',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M6.5 5.5h15a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H12l-5 4v-4H6.5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="m14 9 1.1 2.7L18 12.8l-2.9 1.1L14 16.6l-1.1-2.7L10 12.8l2.9-1.1Z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
]

const APPROACH_PRINCIPLES: ApproachPrinciple[] = [
  {
    number: '01',
    title: 'Thoughtful Accessibility',
    description:
      'Clean typography, calm spacing, and responsive navigation allow visitors on phones, tablets, and desktops to engage comfortably.',
  },
  {
    number: '02',
    title: 'Authentic & Attributed Sources',
    description:
      'Qur’anic script, translations, supplications, and Hadith references are attributed directly to established sources rather than left ambiguous.',
  },
  {
    number: '03',
    title: 'Respectful Presentation',
    description:
      'No intrusive ads, noisy feeds, or visual clutter compete with the words of the Qur’an and Prophetic traditions.',
  },
  {
    number: '04',
    title: 'Responsible Technology',
    description:
      'Modern web tools and AI lookup are designed as supportive study companions, always honoring the guidance of qualified scholars.',
  },
]

export function AboutView() {
  return (
    <SubpageLayout shellClassName="editorial-page-shell about-shell">
      <div className="subpage-topbar">
        <Link to="/" className="back-link">
          <span aria-hidden="true">←</span> Back to Home
        </Link>
        <Link to="/get-started" className="topbar-secondary-link">
          Explore Quran Bytes ↗
        </Link>
      </div>

      <header className="editorial-hero editorial-hero-has-mark">
        <svg className="editorial-hero-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path d="M11 43V22c0-7.5 6.2-11.5 13-17 6.8 5.5 13 9.5 13 17v21Z" />
          <path d="M16.5 43V23.5c0-4.8 3.6-7.8 7.5-11 3.9 3.2 7.5 6.2 7.5 11V43" />
          <path d="m24 1 2 2-2 2-2-2Z" />
        </svg>
        <p className="label subpage-kicker">About Us</p>
        <h1 className="subpage-title">
          More than reading. A journey of <em>understanding.</em>
        </h1>
        <p className="subpage-subtitle editorial-lead">
          Quran Bytes is a digital space created to make engaging with the Quran more accessible,
          meaningful and easier to explore. A place to read, reflect, learn and reconnect with the
          teachings of Islam.
        </p>
      </header>

      <section className="editorial-section editorial-split" aria-labelledby="about-story-heading">
        <div className="editorial-label-col">
          <p className="label editorial-kicker">Our Story</p>
          <h2 id="about-story-heading" className="editorial-section-title">
            Why <em>Quran Bytes?</em>
          </h2>
        </div>
        <div className="editorial-prose-col">
          <p>
            Knowledge becomes meaningful when it is accessible to everyone. Quran Bytes was
            envisioned as a simple, welcoming platform where people can explore the Quran, discover
            its meanings, learn authentic Islamic teachings and strengthen their connection with
            their faith.
          </p>
          <p>
            We believe technology can serve a meaningful purpose when it brings people closer to
            knowledge.
          </p>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="about-explore-heading">
        <div className="editorial-section-head">
          <p className="label editorial-kicker">What You Can Explore</p>
          <h2 id="about-explore-heading" className="editorial-section-title">
            Four pathways to <em>read and reflect.</em>
          </h2>
        </div>

        <div className="editorial-cards-grid">
          {EXPLORE_FEATURES.map((feature) => (
            <Link key={feature.number} to={feature.to} className="editorial-feature-card">
              <div className="editorial-card-head">
                <span className="editorial-card-icon">{feature.icon}</span>
                <span className="label editorial-card-num">{feature.number}</span>
              </div>
              <h3 className="editorial-card-title">{feature.title}</h3>
              <p className="editorial-card-desc">{feature.description}</p>
              <span className="editorial-card-cta">
                <span>{feature.cta}</span>
                <SvgIcon name="icon-arrow" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="about-approach-heading">
        <div className="editorial-split editorial-approach-head">
          <div className="editorial-label-col">
            <p className="label editorial-kicker">Our Approach</p>
            <h2 id="about-approach-heading" className="editorial-section-title">
              Built with purpose. <em>Guided by knowledge.</em>
            </h2>
          </div>
          <div className="editorial-prose-col">
            <p>
              Every part of Quran Bytes is shaped around clarity, reverence for source texts, and
              calm interaction. Rather than overwhelming visitors, our goal is a quiet, dependable
              study environment where responsible technology serves enduring Islamic scholarship.
            </p>
          </div>
        </div>

        <ol className="editorial-principles-grid">
          {APPROACH_PRINCIPLES.map((item) => (
            <li key={item.number} className="editorial-principle-item">
              <span className="label editorial-principle-num">{item.number}</span>
              <div>
                <h3 className="editorial-principle-title">{item.title}</h3>
                <p className="editorial-principle-desc">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="editorial-cta-band" aria-labelledby="about-cta-heading">
        <div>
          <p className="label editorial-kicker">Start Exploring</p>
          <h2 id="about-cta-heading" className="editorial-cta-title">
            Begin your <em>journey.</em>
          </h2>
        </div>
        <Link to="/get-started" className="editorial-cta-btn">
          <span>Explore Quran Bytes</span>
          <SvgIcon name="icon-arrow" />
        </Link>
      </section>
    </SubpageLayout>
  )
}

export default AboutView
