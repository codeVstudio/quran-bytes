import { useEffect, useRef, useState } from 'react'
import SvgIcon from '@/components/shared/SvgIcon'
import { cn } from '@/utils/classNames'

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let missionStart = 0
    let missionEnd = 0
    let headerHeight = 83
    let scheduled = false

    const update = () => {
      const y = window.scrollY
      setScrolled(y > 25)
      setDark(
        missionEnd > missionStart &&
          y + headerHeight >= missionStart &&
          y + headerHeight < missionEnd,
      )
      scheduled = false
    }

    const measure = () => {
      const mission = document.getElementById('vision')
      const scrolledCss = parseFloat(
        getComputedStyle(header).getPropertyValue('--header-scrolled-h'),
      )
      headerHeight =
        Number.isFinite(scrolledCss) && scrolledCss > 0 ? scrolledCss : header.offsetHeight || 68

      if (mission) {
        const rect = mission.getBoundingClientRect()
        missionStart = rect.top + window.scrollY
        missionEnd = rect.bottom + window.scrollY
      } else {
        missionStart = 0
        missionEnd = 0
      }
      update()
    }

    const onScroll = () => {
      if (!scheduled) {
        scheduled = true
        window.requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    let ro: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(measure)
      ro.observe(document.body)
    }

    document.fonts?.ready.then(measure)
    window.addEventListener('load', measure, { once: true })
    measure()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      ro?.disconnect()
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className={cn('site-header', scrolled && 'is-scrolled', dark && 'is-dark')}
      id="site-header"
    >
      <a className="brand" href="#top" aria-label="Quran Bytes, back to top">
        <svg className="brand-mark" viewBox="0 0 32 43" fill="none" aria-hidden="true">
          <path d="M3 40V18C3 11 10 7 16 2c6 5 13 9 13 16v22Z" />
          <path d="M9 34V20c0-4 4-7 7-10 3 3 7 6 7 10v14" />
          <path d="M1 40h30" />
        </svg>
        <span>
          quran <i>bytes</i>
          <span className="brand-period">.</span>
        </span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#vision">Vision</a>
        <a href="#explore">Explore</a>
        <a className="nav-join" href="#get-involved">
          Get involved <SvgIcon name="icon-arrow-up" />
        </a>
      </nav>
    </header>
  )
}

export default Header
