import { useState, type CSSProperties } from 'react'
import type { RecitationSpeed } from '@/@types/quran'
import ArabicVerse from '@/components/shared/ArabicVerse'
import SvgIcon from '@/components/shared/SvgIcon'
import { usePrefersReducedMotion } from '@/utils/hooks/useMotion'
import { cn } from '@/utils/classNames'

const SPEEDS: RecitationSpeed[] = [1, 0.75, 1.25]
const WAVEFORM_BARS = Array.from({ length: 27 }, (_, index) => index)

export function ReadChapter() {
  const reducedMotion = usePrefersReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(true)
  const [statusMessage, setStatusMessage] = useState('Try the visual preview. Audio is planned.')

  const speed = SPEEDS[speedIndex]

  const handleTogglePlay = () => {
    setPlaying((prev) => {
      const next = !prev
      setStatusMessage(
        next ? 'Visual preview only — no audio is playing.' : 'Preview paused. Audio is planned.',
      )
      return next
    })
  }

  const handleCycleSpeed = () => {
    setSpeedIndex((prev) => (prev + 1) % SPEEDS.length)
  }

  return (
    <article className="chapter chapter-read" id="read" aria-labelledby="read-title">
      <div className="chapter-copy">
        <p className="chapter-kicker label">
          01 / Read <span className="planned-inline">Planned</span>
        </p>
        <h2 id="read-title">
          <span className="text-line">
            <span>Begin with</span>
          </span>
          <span className="text-line">
            <span>
              <em>an ayah.</em>
            </span>
          </span>
        </h2>
        <p className="chapter-description">
          Less noise. More presence. A thoughtful space to read at your own pace, one ayah at a
          time.
        </p>
      </div>
      <div className="concept concept-read" aria-label="Concept preview of the reading experience">
        <div className="concept-heading label">
          <span>
            Al-Muzzammil <span className="muted">/ 73:4</span>
          </span>
          <span className="concept-tag">Concept preview</span>
        </div>
        <div className="manuscript-content">
          <svg className="verse-ornament" aria-hidden="true">
            <use href="#icon-star" />
          </svg>
          <ArabicVerse text="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا" />
          <span className="verse-number" aria-label="Verse 4">
            ٤
          </span>
          <div
            className="translation-wrap"
            id="reading-translation"
            style={{ visibility: showTranslation ? 'visible' : 'hidden' }}
          >
            <p className="verse-translation">
              “…and recite the Qur’an with
              <br />
              measured recitation.”
            </p>
            <span className="source-label">
              Surah Al-Muzzammil 73:4 · excerpt
              <br />
              Translation: Saheeh International
            </span>
          </div>
        </div>
        <div className="reading-tools">
          <button
            className="play-button magnetic"
            id="recitation-preview"
            type="button"
            aria-label={
              playing
                ? 'Pause visual recitation preview'
                : 'Play visual recitation preview, no audio'
            }
            aria-pressed={playing}
            onClick={handleTogglePlay}
          >
            <SvgIcon name={playing ? 'icon-pause' : 'icon-play'} />
          </button>
          <div className="recitation-info">
            <span className="label">
              Recitation <span className="muted">/ Planned</span>
            </span>
            <div
              className={cn('waveform', playing && !reducedMotion && 'is-playing')}
              id="waveform"
              aria-hidden="true"
              style={{ '--preview-speed': `${1 / speed}s` } as CSSProperties}
            >
              {WAVEFORM_BARS.map((bar) => (
                <i key={bar} />
              ))}
            </div>
          </div>
          <button
            className="speed-control"
            id="preview-speed"
            type="button"
            aria-label={`Visual preview speed: ${speed} times`}
            onClick={handleCycleSpeed}
          >
            {speed}×
          </button>
          <button
            className="translation-toggle"
            id="translation-toggle"
            type="button"
            aria-controls="reading-translation"
            aria-pressed={showTranslation}
            aria-label="Show English translation"
            onClick={() => setShowTranslation((prev) => !prev)}
          >
            Aa
          </button>
        </div>
        <p className="concept-footnote" id="recitation-status" role="status">
          {statusMessage}
        </p>
      </div>
    </article>
  )
}

export default ReadChapter
