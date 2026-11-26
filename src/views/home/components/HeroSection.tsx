import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SvgIcon from '@/components/shared/SvgIcon'
import { usePrefersReducedMotion } from '@/utils/hooks/useMotion'

const SKY_STAR_CLASSES = [
  'sky-star-one',
  'sky-star-two',
  'sky-star-three',
  'sky-star-four',
  'sky-star-five',
  'sky-star-six',
  'sky-star-seven',
  'sky-star-eight',
  'sky-star-nine',
  'sky-star-ten',
  'sky-star-eleven',
  'sky-star-twelve',
  'sky-star-thirteen',
  'sky-star-fourteen',
  'sky-star-fifteen',
  'sky-star-sixteen',
  'sky-star-seventeen',
  'sky-star-eighteen',
]

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const root = document.documentElement
    const lastLine = document.querySelector<HTMLElement>(
      '#hero-title .text-line:last-child > span',
    )
    if (!lastLine) return

    let fallbackTimer = 0
    const finish = () => {
      clearTimeout(fallbackTimer)
      root.classList.remove('hero-reveal-ready', 'hero-reveal-play')
      lastLine.removeEventListener('animationend', onEnd)
      document.removeEventListener('qb:intro-complete', play)
    }

    const onEnd = (event: AnimationEvent) => {
      if (event.target === lastLine && event.animationName === 'hero-line-reveal') {
        finish()
      }
    }

    const play = () => {
      root.classList.add('hero-reveal-play')
      fallbackTimer = window.setTimeout(finish, 1800)
    }

    root.classList.add('hero-reveal-ready')
    lastLine.addEventListener('animationend', onEnd)

    if (root.classList.contains('is-intro-active')) {
      document.addEventListener('qb:intro-complete', play, { once: true })
    } else {
      play()
    }

    return () => {
      clearTimeout(fallbackTimer)
      lastLine.removeEventListener('animationend', onEnd)
      document.removeEventListener('qb:intro-complete', play)
      root.classList.remove('hero-reveal-ready', 'hero-reveal-play')
    }
  }, [reducedMotion])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden="true">
        <svg className="sky-moon" viewBox="0 0 24 24" focusable="false">
          <path d="M20.9 13.35A9 9 0 1 1 10.65 3.1a7 7 0 0 0 10.25 10.25Z" />
        </svg>
        {SKY_STAR_CLASSES.map((cls) => (
          <svg key={cls} className={`sky-star ${cls}`} viewBox="0 0 16 16" focusable="false">
            <use href="#sky-star" />
          </svg>
        ))}
      </div>
      <div className="hero-copy">
        <h1 id="hero-title">
          <span className="text-line">
            <span>Read.</span>
          </span>
          <span className="text-line hero-italic">
            <span>
              <em>Reflect.</em>
            </span>
          </span>
          <span className="text-line">
            <span>Remember.</span>
          </span>
        </h1>
        <p className="hero-description">
          A free, open-source space for Qur’an,
          <br className="desktop-break" /> Sunnah, and lifelong learning.
        </p>
        <Link className="hero-cta hero-start-btn" to="/get-started">
          <span>Get Started</span>
          <SvgIcon name="icon-arrow" />
        </Link>
      </div>
    </section>
  )
}

export default HeroSection
