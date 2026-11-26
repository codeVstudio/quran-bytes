import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SvgIcon from '@/components/shared/SvgIcon'
import Footer from '@/components/template/Footer'
import { usePrefersReducedMotion } from '@/utils/hooks/useMotion'

interface ExplorePath {
  id: string
  to: string
  kicker: string
  title: string
  description: string
  cta: string
  icon: JSX.Element
}

const EXPLORE_PATHS: ExplorePath[] = [
  {
    id: 'read',
    to: '/read',
    kicker: '01 · Holy Qur’an',
    title: 'Read Quran',
    description:
      'Read the Holy Quran with a beautiful, distraction-free reading experience.',
    cta: 'Start Reading',
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
    id: 'translation',
    to: '/translation',
    kicker: '02 · Meanings & Context',
    title: 'Quran Translation',
    description:
      'Understand the meaning and message of the Quran through translations.',
    cta: 'Explore Translation',
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
    id: 'dua-hadith',
    to: '/dua-hadith',
    kicker: '03 · Sunnah & Supplications',
    title: 'Dua & Hadith',
    description:
      'Explore authentic daily duas, supplications, and Hadith collections.',
    cta: 'Explore',
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
    id: 'assistant',
    to: '/assistant',
    kicker: '04 · Guided Lookup',
    title: 'AI Islamic Assistant',
    description:
      'Ask questions about Islam, Quran, Hadith, and Islamic teachings.',
    cta: 'Ask AI',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M23 13a9 9 0 0 1-9 9c-1.5 0-2.9-.35-4.1-.95L4.5 22.8l1.75-4.9A9 9 0 1 1 23 13Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="m14 8.5 1.05 3.45L18.5 13l-3.45 1.05L14 17.5l-1.05-3.45L9.5 13l3.45-1.05Z"
          stroke="currentColor"
          strokeWidth="1.15"
        />
      </svg>
    ),
  },
]

export function GetStartedView() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <main id="main" className="subpage-shell get-started-shell">
      <div className="subpage-container">
        <nav className="subpage-breadcrumb" aria-label="Back navigation">
          <Link to="/" className="back-link">
            <span aria-hidden="true">←</span> Back to Home
          </Link>
        </nav>

        <header className="get-started-header">
          <p className="label subpage-kicker">Your Learning Path</p>
          <h1 className="subpage-title">
            What would you like to <em>explore today?</em>
          </h1>
          <p className="subpage-subtitle">
            Choose your path to learn, reflect, and strengthen your connection with the Qur’an and
            Sunnah.
          </p>
        </header>

        <section className="explore-grid" aria-label="Learning destinations">
          {EXPLORE_PATHS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reducedMotion ? 0 : idx * 0.06 }}
            >
              <Link to={item.to} className="explore-card">
                <svg className="explore-card-ornament" viewBox="0 0 40 40" aria-hidden="true">
                  <use href="#icon-star" />
                </svg>
                <div className="explore-card-top">
                  <span className="explore-card-icon">{item.icon}</span>
                  <span className="label explore-card-kicker">{item.kicker}</span>
                </div>
                <h2 className="explore-card-title">{item.title}</h2>
                <p className="explore-card-desc">{item.description}</p>
                <span className="explore-card-cta">
                  <span>{item.cta}</span>
                  <SvgIcon name="icon-arrow" />
                </span>
              </Link>
            </motion.div>
          ))}
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default GetStartedView
