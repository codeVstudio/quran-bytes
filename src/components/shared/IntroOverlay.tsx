import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/store/hook'
import { setIntroComplete } from '@/store/slices/base/commonSlice'
import { cn } from '@/utils/classNames'

const FADE_DELAY_MS = 1400
const END_DELAY_MS = 1850

export function IntroOverlay() {
  const dispatch = useAppDispatch()
  const introRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('is-intro-active')
  })
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (introRef.current) {
      introRef.current.inert = !visible
    }
  }, [visible])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement

    if (reduced || !visible) {
      root.classList.remove('is-intro-active', 'is-intro-leaving')
      document.body.removeAttribute('aria-busy')
      setVisible(false)
      dispatch(setIntroComplete(true))
      document.dispatchEvent(new Event('qb:intro-complete'))
      return
    }

    const setRegionsInert = (inertValue: boolean) => {
      const selectors = ['#site-header', '#main', '#site-help', '.skip-link']
      selectors.forEach((selector) => {
        const el = document.querySelector<HTMLElement>(selector)
        if (el) el.inert = inertValue
      })
    }

    let finished = false
    document.body.setAttribute('aria-busy', 'true')
    setRegionsInert(true)

    const finish = () => {
      if (finished) return
      finished = true
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
      setVisible(false)
      setLeaving(false)
      root.classList.remove('is-intro-active', 'is-intro-leaving')
      document.body.removeAttribute('aria-busy')
      setRegionsInert(false)
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
      } catch {
        window.scrollTo(0, 0)
      }
      dispatch(setIntroComplete(true))
      document.dispatchEvent(new Event('qb:intro-complete'))
    }

    const fadeTimer = window.setTimeout(() => {
      root.classList.add('is-intro-leaving')
      setLeaving(true)
    }, FADE_DELAY_MS)

    const endTimer = window.setTimeout(finish, END_DELAY_MS)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(endTimer)
      setRegionsInert(false)
    }
  }, [dispatch, visible])

  return (
    <div
      ref={introRef}
      className={cn('intro', visible && 'is-visible', leaving && 'is-leaving')}
      id="intro"
      role="status"
      aria-label="Opening Quran Bytes"
      aria-hidden={!visible}
    >
      <div className="intro-mark">
        <svg viewBox="0 0 80 110" fill="none" aria-hidden="true">
          <path d="M10 102V45C10 27 24 19 40 7c16 12 30 20 30 38v57Z" />
          <path d="M22 90V49c0-12 9-18 18-26 9 8 18 14 18 26v41M6 102h68" />
        </svg>
        <span className="intro-wordmark">
          quran <i>bytes</i>
          <b>.</b>
        </span>
        <span className="intro-caption">Read. Reflect. Remember.</span>
        <span className="intro-progress" aria-hidden="true" />
      </div>
    </div>
  )
}

export default IntroOverlay
