import { Link } from 'react-router-dom'
import SubpageLayout from '@/components/layouts/SubpageLayout'
import SvgIcon from '@/components/shared/SvgIcon'

interface MissionPillar {
  number: string
  title: string
  description: string
  icon: JSX.Element
}

const MISSION_PILLARS: MissionPillar[] = [
  {
    number: '01',
    title: 'Accessibility',
    description:
      'Make Quranic reading and learning accessible through a simple, welcoming digital experience.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 9c-3-2-7-2.7-11-2.2v17c4-.5 8 .3 11 2.2 3-1.9 7-2.7 11-2.2v-17C23 6.3 19 7 16 9Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <path d="M16 9v17" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Understanding',
    description: 'Help people explore translations, meanings and Islamic knowledge.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="13.5" height="17" rx="2" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="M18.5 11H24a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H12.5a2 2 0 0 1-2-2v-3"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path d="M9 11.5h5.5M9 15.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Authenticity',
    description:
      'Prioritize reliable references, responsible presentation and respect for Islamic scholarship.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="m16 4 3.6 3.6H25v5.4L28.6 16 25 19.6V25h-5.4L16 28.6 12.4 25H7v-5.4L3.4 16 7 12.4V7h5.4Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Innovation',
    description: 'Use modern technology and AI responsibly to support learning and discovery.',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.35" />
        <path
          d="m16 8.5 2.1 5.4 5.4 2.1-5.4 2.1L16 23.5l-2.1-5.4L8.5 16l5.4-2.1Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export function VisionView() {
  return (
    <SubpageLayout shellClassName="editorial-page-shell vision-page-shell">
      <div className="subpage-topbar">
        <Link to="/" className="back-link">
          <span aria-hidden="true">←</span> Back to Home
        </Link>
        <Link to="/about" className="topbar-secondary-link">
          About Quran Bytes ↗
        </Link>
      </div>

      <header className="editorial-hero vision-editorial-hero">
        <p className="label subpage-kicker">Our Vision</p>
        <h1 className="subpage-title">
          Bringing knowledge closer. <em>Inspiring reflection.</em>
        </h1>
        <p className="subpage-subtitle editorial-lead">
          Our vision is to make authentic Islamic knowledge more accessible through thoughtful
          design and meaningful technology.
        </p>
      </header>

      <section className="vision-manifesto" aria-labelledby="vision-statement-heading">
        <svg className="vision-manifesto-arch" viewBox="0 0 120 150" fill="none" aria-hidden="true">
          <path d="M12 142V66C12 42 34 26 60 8c26 18 48 34 48 58v76" />
          <path d="M28 142V72c0-17 15-29 32-41 17 12 32 24 32 41v70" />
          <circle cx="60" cy="68" r="10" />
        </svg>
        <div className="vision-manifesto-copy">
          <p className="label editorial-kicker">Our Vision</p>
          <h2 id="vision-statement-heading" className="vision-manifesto-title">
            A meaningful connection <em>with the Quran.</em>
          </h2>
          <p className="vision-manifesto-text">
            We envision a digital environment where anyone can read, understand, explore and
            reflect on the Quran without unnecessary barriers.
          </p>
        </div>
      </section>

      <section className="editorial-section" aria-labelledby="vision-mission-heading">
        <div className="editorial-section-head">
          <p className="label editorial-kicker">Our Mission</p>
          <h2 id="vision-mission-heading" className="editorial-section-title">
            Guiding commitments for <em>lasting clarity.</em>
          </h2>
        </div>

        <div className="mission-cards-grid">
          {MISSION_PILLARS.map((pillar) => (
            <article key={pillar.number} className="mission-pillar-card">
              <div className="editorial-card-head">
                <span className="mission-pillar-icon">{pillar.icon}</span>
                <span className="label editorial-card-num">{pillar.number}</span>
              </div>
              <h3 className="editorial-card-title">{pillar.title}</h3>
              <p className="editorial-card-desc">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section editorial-split" aria-labelledby="vision-ahead-heading">
        <div className="editorial-label-col">
          <p className="label editorial-kicker">Looking Ahead</p>
          <h2 id="vision-ahead-heading" className="editorial-section-title">
            A journey <em>that continues.</em>
          </h2>
        </div>
        <div className="editorial-prose-col">
          <p>
            Quran Bytes aims to grow into a thoughtful digital learning space, bringing together
            reading, understanding, exploration and technology while keeping the Quran at its
            heart.
          </p>
        </div>
      </section>

      <section className="editorial-cta-band" aria-labelledby="vision-cta-heading">
        <div>
          <p className="label editorial-kicker">Explore With Us</p>
          <h2 id="vision-cta-heading" className="editorial-cta-title">
            Explore what <em>we’re building.</em>
          </h2>
        </div>
        <Link to="/get-started" className="editorial-cta-btn">
          <span>Get Started</span>
          <SvgIcon name="icon-arrow" />
        </Link>
      </section>
    </SubpageLayout>
  )
}

export default VisionView
