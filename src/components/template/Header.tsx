import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '@/utils/hooks/useAuth'
import { cn } from '@/utils/classNames'

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { authenticated, user, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    let missionStart = 0
    let missionEnd = 0
    let headerHeight = 83
    let scheduled = false

    const update = () => {
      const y = window.scrollY
      setScrolled(!isHome || y > 25)
      setDark(
        isHome &&
          missionEnd > missionStart &&
          y + headerHeight >= missionStart &&
          y + headerHeight < missionEnd,
      )
      scheduled = false
    }

    const measure = () => {
      const mission = isHome ? document.getElementById('vision') : null
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
  }, [isHome])

  return (
    <header
      ref={headerRef}
      className={cn(
        'site-header',
        (scrolled || !isHome) && 'is-scrolled',
        dark && 'is-dark',
        !isHome && 'is-subpage-header',
      )}
      id="site-header"
    >
      <Link
        className="brand"
        to="/"
        aria-label="Quran Bytes, home"
        onClick={(e) => {
          if (isHome) {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        }}
      >
        <svg className="brand-mark" viewBox="0 0 32 43" fill="none" aria-hidden="true">
          <path d="M3 40V18C3 11 10 7 16 2c6 5 13 9 13 16v22Z" />
          <path d="M9 34V20c0-4 4-7 7-10 3 3 7 6 7 10v14" />
          <path d="M1 40h30" />
        </svg>
        <span>
          quran <i>bytes</i>
          <span className="brand-period">.</span>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Main navigation">
        {!isHome && location.pathname !== '/get-started' && (
          <Link className="nav-sub-link" to="/get-started">
            Explore
          </Link>
        )}
        {authenticated ? (
          <div className="nav-account">
            <Link className="nav-user-pill" to="/get-started" title={`Signed in as ${user.email}`}>
              <span className="nav-user-dot" aria-hidden="true" />
              <span>{user.name.split(' ')[0] || 'Account'}</span>
            </Link>
            <button
              type="button"
              className="nav-login-btn"
              onClick={() => {
                signOut()
                if (location.pathname === '/login') navigate('/')
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link className="nav-login-btn" to="/login">
            Login
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
