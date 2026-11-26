import { useEffect, useState } from 'react'
import { cn } from '@/utils/classNames'
import { usePrefersReducedMotion } from '@/utils/hooks/useMotion'

interface ChapterPage {
  id: string
  number: string
  title: string
  headline: string
}

const CHAPTER_PAGES: ChapterPage[] = [
  { id: 'read', number: '01', title: 'Read', headline: 'Begin with an ayah.' },
  { id: 'memorize', number: '02', title: 'Memorize', headline: 'Return. Repeat. Remember.' },
  { id: 'understand', number: '03', title: 'Understand', headline: 'Explore the meaning.' },
  { id: 'practice', number: '04', title: 'Practice', headline: 'Carry learning into your day.' },
]

export function ChapterIndex() {
  const reducedMotion = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState(CHAPTER_PAGES[0].id)

  useEffect(() => {
    let rafId = 0

    const updateActive = () => {
      rafId = 0
      const focusY = window.innerHeight * 0.45
      let closestId = CHAPTER_PAGES[0].id
      let bestDistance = Infinity

      for (const page of CHAPTER_PAGES) {
        const el = document.getElementById(page.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= focusY && rect.bottom >= focusY) {
          closestId = page.id
          bestDistance = 0
          break
        }
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - focusY)
        if (distance < bestDistance) {
          bestDistance = distance
          closestId = page.id
        }
      }

      setActiveId((prev) => (prev === closestId ? prev : closestId))
    }

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateActive)
      }
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    updateActive()

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  const activePage = CHAPTER_PAGES.find((page) => page.id === activeId) ?? CHAPTER_PAGES[0]
  const totalLabel = String(CHAPTER_PAGES.length).padStart(2, '0')

  const handleJump = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    setActiveId(id)
    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="journey-page-track">
      <nav className="journey-page-rail" aria-label="Chapter page index">
        <div className="journey-page-counter" aria-live="polite">
          <span className="journey-page-count">
            <strong>{activePage.number}</strong>
            <span className="journey-page-total"> / {totalLabel}</span>
          </span>
          <span className="journey-page-active-title">{activePage.title}</span>
        </div>

        <ul className="journey-page-list">
          {CHAPTER_PAGES.map((page) => {
            const isActive = page.id === activeId
            return (
              <li key={page.id}>
                <a
                  href={`#${page.id}`}
                  className={cn('journey-page-link', isActive && 'is-active')}
                  aria-current={isActive ? 'location' : undefined}
                  title={`${page.number} / ${totalLabel} — ${page.title}: ${page.headline}`}
                  onClick={(event) => {
                    event.preventDefault()
                    handleJump(page.id)
                  }}
                >
                  <span className="journey-page-num">{page.number}</span>
                  <span className="journey-page-name">{page.title}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default ChapterIndex
