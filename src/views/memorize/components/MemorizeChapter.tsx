import { useCallback, useEffect, useRef, useState } from 'react'
import ArabicVerse from '@/components/shared/ArabicVerse'
import SvgIcon from '@/components/shared/SvgIcon'
import { cn } from '@/utils/classNames'

const VERSE_TEXT = 'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا'
const MASKED_WORD = 'تَرْتِيلًا'

interface MaskRect {
  left: number
  top: number
  width: number
  height: number
}

export function MemorizeChapter() {
  const containerRef = useRef<HTMLDivElement>(null)
  const verseRef = useRef<HTMLParagraphElement>(null)
  const maskRef = useRef<HTMLButtonElement>(null)
  const hideButtonRef = useRef<HTMLButtonElement>(null)

  const [revealed, setRevealed] = useState(false)
  const [repeats, setRepeats] = useState(0)
  const [statusMessage, setStatusMessage] = useState('Tap the covered word to reveal it.')
  const [maskRect, setMaskRect] = useState<MaskRect | null>(null)

  const positionMask = useCallback(() => {
    const verse = verseRef.current
    const container = containerRef.current
    if (!verse || !container) return

    const textNode = verse.firstChild
    if (!textNode || !textNode.textContent) return
    const start = textNode.textContent.lastIndexOf(MASKED_WORD)
    if (start < 0) return

    const range = document.createRange()
    range.setStart(textNode, start)
    range.setEnd(textNode, start + MASKED_WORD.length)
    const rect = range.getBoundingClientRect()
    const parent = container.getBoundingClientRect()

    setMaskRect({
      left: rect.left - parent.left - 5,
      top: rect.top - parent.top - 2,
      width: rect.width + 10,
      height: rect.height + 4,
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    let ro: ResizeObserver | null = null
    if ('ResizeObserver' in window && container) {
      ro = new ResizeObserver(positionMask)
      ro.observe(container)
    }
    window.addEventListener('resize', positionMask, { passive: true })
    document.fonts?.ready.then(positionMask)
    positionMask()

    return () => {
      window.removeEventListener('resize', positionMask)
      ro?.disconnect()
    }
  }, [positionMask])

  const handleReveal = () => {
    setRevealed(true)
    setStatusMessage('The word is revealed. Read it, then try recalling it again.')
    requestAnimationFrame(() => hideButtonRef.current?.focus({ preventScroll: true }))
  }

  const handleHide = () => {
    setRevealed(false)
    setStatusMessage('Tap the covered word to reveal it.')
    requestAnimationFrame(() => {
      positionMask()
      maskRef.current?.focus({ preventScroll: true })
    })
  }

  const handleRepeat = () => {
    setRepeats((prev) => {
      const next = prev === 3 ? 0 : prev + 1
      setStatusMessage(
        next === 3
          ? 'Three repetitions complete. Tap the arrow to begin a new loop.'
          : `${next} of 3 repetitions marked in this preview.`,
      )
      return next
    })
  }

  return (
    <article
      className="chapter chapter-memorize chapter-reverse"
      id="memorize"
      aria-labelledby="memorize-title"
    >
      <div className="chapter-copy">
        <p className="chapter-kicker label">
          02 / Memorize <span className="planned-inline">Planned</span>
        </p>
        <h2 id="memorize-title">
          <span className="text-line">
            <span>Return. Repeat.</span>
          </span>
          <span className="text-line">
            <span>
              <em>Remember.</em>
            </span>
          </span>
        </h2>
        <p className="chapter-description">
          What stays with us is what we return to. Build a gentle rhythm of hifz, without the
          pressure to rush.
        </p>
      </div>
      <div
        className="concept concept-memorize"
        aria-label="Concept preview of memorization practice"
      >
        <div className="concept-heading label">
          <span>
            Hifz practice <span className="muted">/ 73:4</span>
          </span>
          <span className="concept-tag">Concept preview</span>
        </div>
        <div className="memorize-content">
          <span className="label practice-prompt">A moment to recall</span>
          <div ref={containerRef} className="verse-practice" id="verse-practice">
            <ArabicVerse ref={verseRef} id="practice-verse" text={VERSE_TEXT} />
            <button
              ref={maskRef}
              className="word-mask"
              id="word-mask"
              type="button"
              aria-label="Reveal the hidden word"
              aria-expanded={revealed}
              hidden={revealed}
              onClick={handleReveal}
              style={
                maskRect
                  ? {
                      left: `${maskRect.left}px`,
                      top: `${maskRect.top}px`,
                      width: `${maskRect.width}px`,
                      height: `${maskRect.height}px`,
                    }
                  : undefined
              }
            >
              <span className="word-mask-pill">
                <svg
                  className="word-mask-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="2.75" />
                </svg>
                <span>Reveal</span>
              </span>
            </button>
          </div>
          <p className="source-label">Surah Al-Muzzammil 73:4 · excerpt</p>
          <button
            ref={hideButtonRef}
            className="small-text-button"
            id="hide-word"
            type="button"
            hidden={!revealed}
            onClick={handleHide}
          >
            <svg
              className="hide-word-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 3 18 18" />
              <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
              <path d="M9.88 5.09A10.4 10.4 0 0 1 12 4.88c6.5 0 10 7.12 10 7.12a17.6 17.6 0 0 1-3.17 4.35" />
              <path d="M6.61 6.61A17.7 17.7 0 0 0 2 12s3.5 7.12 10 7.12c1.73 0 3.31-.42 4.7-1.12" />
            </svg>
            <span>Hide word</span>
          </button>
        </div>
        <div className="repeat-panel">
          <div>
            <span className="label">Your practice loop</span>
            <p>
              <span id="repeat-count">{repeats}</span>{' '}
              <span className="muted">of 3 repetitions</span>
            </p>
          </div>
          <div className="repeat-dots" aria-hidden="true">
            {[0, 1, 2].map((dotIndex) => (
              <i key={dotIndex} className={cn(dotIndex < repeats && 'is-complete')} />
            ))}
          </div>
          <button
            className="round-arrow magnetic"
            id="repeat-button"
            type="button"
            aria-label={
              repeats === 3 ? 'Start a new practice loop' : 'Mark one repetition complete'
            }
            onClick={handleRepeat}
          >
            <SvgIcon name="icon-arrow" />
          </button>
        </div>
        <div className="revision-line">
          <span className="label">
            Revision <span className="muted">/ Planned</span>
          </span>
          <div>
            <span className="is-current">Today</span>
            <span>+3 days</span>
            <span>+7 days</span>
          </div>
        </div>
        <p className="concept-footnote" id="memorize-status" role="status">
          {statusMessage}
        </p>
      </div>
    </article>
  )
}

export default MemorizeChapter
