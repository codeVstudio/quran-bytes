import { useEffect, useRef } from 'react'

export function QuranArchStage() {
  const stageRef = useRef<HTMLDivElement>(null)
  const bobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bob = bobRef.current
    const hero = document.getElementById('top')
    if (!bob || !hero || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(([entry]) => {
      bob.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sync = () => {
      const hero = document.querySelector<HTMLElement>('.hero')
      const heroCopy = document.querySelector<HTMLElement>('.hero-copy')
      const heroDesc = document.querySelector<HTMLElement>('.hero-description')
      const stage = stageRef.current
      if (!hero || !heroCopy || !heroDesc || !stage) return

      const isPortraitPhone = window.innerWidth < 600 && window.innerHeight > 560
      if (!isPortraitPhone) {
        hero.style.removeProperty('--mobile-stage-gap')
        stage.style.removeProperty('--mobile-stage-top')
        return
      }

      const heroRect = hero.getBoundingClientRect()
      const descRect = heroDesc.getBoundingClientRect()
      const stageHeight = stage.offsetHeight || 240
      const topGap = 14
      const bottomGap = 18
      const descBottom = descRect.bottom - heroRect.top
      hero.style.setProperty(
        '--mobile-stage-gap',
        `${Math.ceil(stageHeight + topGap + bottomGap)}px`,
      )
      stage.style.setProperty(
        '--mobile-stage-top',
        `${Math.round(heroRect.top + window.scrollY + descBottom + topGap + stageHeight / 2)}px`,
      )
    }

    window.addEventListener('resize', sync, { passive: true })
    window.addEventListener('orientationchange', sync, { passive: true })

    let ro: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(sync)
      const hero = document.querySelector<HTMLElement>('.hero')
      const heroCopy = document.querySelector<HTMLElement>('.hero-copy')
      const heroDesc = document.querySelector<HTMLElement>('.hero-description')
      if (hero) ro.observe(hero)
      if (heroCopy) ro.observe(heroCopy)
      if (heroDesc) ro.observe(heroDesc)
      if (stageRef.current) ro.observe(stageRef.current)
    }

    document.fonts?.ready.then(sync)
    window.addEventListener('load', sync, { once: true })
    sync()

    return () => {
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
      window.removeEventListener('load', sync)
      ro?.disconnect()
    }
  }, [])

  return (
    <div ref={stageRef} className="visual-stage" id="visual-stage" aria-hidden="true">
      <div className="stage-position">
        <div className="stage-tilt">
          <div className="arch-assembly">
            <svg className="arch-layer arch-back" viewBox="0 0 420 600">
              <use href="#arch-line" fill="#E8E2D4" stroke="#D7CEBB" strokeWidth="1" />
              <path d="M10 587h400M210 2v12" stroke="#A59E87" strokeWidth=".7" />
            </svg>
            <svg className="arch-layer arch-middle" viewBox="0 0 420 600">
              <use href="#arch-line" fill="#F1ECDF" stroke="#C8BEA8" strokeWidth=".8" />
              <g clipPath="url(#arch-clip)" className="arch-pattern">
                <rect width="420" height="600" fill="url(#geometry)" />
              </g>
              <path
                d="M42 564V246C42 161 118 118 210 44c92 74 168 117 168 202v318Z"
                fill="none"
                stroke="#B6AD94"
                strokeWidth=".5"
              />
            </svg>
            <svg className="arch-layer arch-front" viewBox="0 0 420 600" fill="none">
              <use href="#arch-line" stroke="#8D947A" strokeWidth=".9" />
              <path
                d="M36 580V245C36 155 114 110 210 36c96 74 174 119 174 209v335M19 580h382M210 13v17"
                stroke="#9CA187"
                strokeWidth=".5"
              />
              <path
                d="M12 250h18M390 250h18M12 498h18M390 498h18"
                stroke="#9CA187"
                strokeWidth=".6"
              />
              <path d="m210 11 3 4-3 4-3-4Z" fill="#C2A15A" stroke="none" />
            </svg>
          </div>
          <div className="book-float">
            <div ref={bobRef} className="book-bob">
              <div className="book">
                <div className="book-back" />
                <div className="book-page-block">
                  <img
                    src="/img/quran-inner-page.webp"
                    width={753}
                    height={1024}
                    alt=""
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <div className="book-edge book-edge-side" />
                <div className="book-edge book-edge-top" />
                <div className="book-spine">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="book-ribbon" />
                <div className="book-cover">
                  <div className="cover-outside">
                    <img
                      src="/img/quran-cover.webp"
                      width={720}
                      height={978}
                      alt="Black Qur’an cover with gold Arabic calligraphy and ornamental borders"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                  <div className="cover-inside" />
                </div>
              </div>
            </div>
          </div>
          <div className="book-shadow" />
        </div>
      </div>
    </div>
  )
}

export default QuranArchStage
