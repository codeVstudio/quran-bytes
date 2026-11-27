import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CookieBanner from '@/components/shared/CookieBanner'
import QuranArchStage from '@/components/shared/QuranArchStage'
import GetInvolvedSection from '@/views/getInvolved/components/GetInvolvedSection'
import MemorizeChapter from '@/views/memorize/components/MemorizeChapter'
import PracticeChapter from '@/views/practice/components/PracticeChapter'
import ReadChapter from '@/views/read/components/ReadChapter'
import UnderstandChapter from '@/views/understand/components/UnderstandChapter'
import VisionSection from '@/views/vision/components/VisionSection'
import ChapterIndex from './components/ChapterIndex'
import HeroSection from './components/HeroSection'

gsap.registerPlugin(ScrollTrigger)

export function HomeView() {
  useEffect(() => {
    const desktopQuery = '(min-width: 1000px) and (prefers-reduced-motion: no-preference)'
    const media = gsap.matchMedia()
    let cancelled = false

    media.add(desktopQuery, () => {
      document.documentElement.classList.add('has-journey-art')
      const position = document.querySelector<HTMLElement>('.stage-position')
      const bookFloat = document.querySelector<HTMLElement>('.book-float')
      const chapters = Array.from(document.querySelectorAll<HTMLElement>('.chapter'))

      if (position) {
        gsap.set(position, { x: 0 })
      }

      const opening = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top -10%',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      opening
        .to(
          '.book',
          {
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            duration: 0.65,
            ease: 'none',
          },
          0,
        )
        .to(
          '.book-cover',
          {
            rotationY: 145,
            duration: 0.65,
            ease: 'none',
          },
          0.05,
        )
        .to(
          '.book-float',
          {
            x: () => -(bookFloat?.offsetWidth ?? 220) * 0.3,
            scale: 0.86,
            duration: 0.7,
            ease: 'none',
          },
          0.05,
        )
        .to(
          '.book-float',
          {
            autoAlpha: 0,
            y: -12,
            duration: 0.2,
            ease: 'none',
          },
          0.8,
        )

      chapters.slice(1).forEach((chapter, index) => {
        if (!position) return
        const left = () => -Math.min(window.innerWidth, 1485) * 0.45
        gsap.fromTo(
          position,
          { x: index % 2 === 0 ? 0 : left },
          {
            x: index % 2 === 0 ? left : 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: chapter,
              start: 'top 85%',
              end: 'top 35%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      gsap.to('#visual-stage', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#vision',
          start: 'top bottom',
          end: 'top 35%',
          scrub: true,
        },
      })

      return () => {
        document.documentElement.classList.remove('has-journey-art')
      }
    })

    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      media.revert()
      document.documentElement.classList.remove('has-journey-art')
    }
  }, [])

  return (
    <>
      <QuranArchStage />
      <main id="main">
        <HeroSection />
        <section className="journey" id="explore" aria-label="Explore the planned learning experience">
          <ChapterIndex />
          <ReadChapter />
          <MemorizeChapter />
          <UnderstandChapter />
          <PracticeChapter />
        </section>
        <VisionSection />
        <GetInvolvedSection />
      </main>
      <CookieBanner />
    </>
  )
}

export default HomeView
