import { useState } from 'react'
import ArabicVerse from '@/components/shared/ArabicVerse'
import Tabs, { type TabItem } from '@/components/ui/Tabs'

const TAB_ITEMS: TabItem[] = [
  {
    id: 'meaning',
    tabId: 'meaning-tab',
    panelId: 'meaning-panel',
    label: 'Translation',
    className: 'meaning-panel',
    content: (
      <>
        <span className="label">
          English <span className="muted">/ Saheeh International</span>
        </span>
        <p className="meaning-translation">
          “…and recite the Qur’an
          <br />
          with measured recitation.”
        </p>
        <div className="meaning-note">
          <span className="note-number">01</span>
          <p>
            A translation is a window into meaning,
            <br className="desktop-break" /> not a replacement for the original.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'sources',
    tabId: 'sources-tab',
    panelId: 'sources-panel',
    label: (
      <>
        Source notes <span aria-hidden="true">↗</span>
      </>
    ),
    className: 'source-panel',
    content: (
      <dl>
        <div>
          <dt>Original</dt>
          <dd>
            Qur’an · Al-Muzzammil 73:4
            <br />
            <span className="muted">Excerpt from the ayah</span>
          </dd>
        </div>
        <div>
          <dt>Translation</dt>
          <dd>
            Saheeh International
            <br />
            <span className="muted">English · excerpt</span>
          </dd>
        </div>
        <div>
          <dt>Tafsir</dt>
          <dd>
            Planned
            <br />
            <span className="muted">Sources to be confirmed</span>
          </dd>
        </div>
      </dl>
    ),
  },
]

export function UnderstandChapter() {
  const [activeTab, setActiveTab] = useState('meaning')

  return (
    <article
      className="chapter chapter-understand"
      id="understand"
      aria-labelledby="understand-title"
    >
      <div className="chapter-copy">
        <p className="chapter-kicker label">
          03 / Understand <span className="planned-inline">Planned</span>
        </p>
        <h2 id="understand-title">
          <span className="text-line">
            <span>Explore</span>
          </span>
          <span className="text-line">
            <span>
              <em>the meaning.</em>
            </span>
          </span>
        </h2>
        <p className="chapter-description">
          Go a little deeper. Keep the words, their translation, and the sources behind them in the
          same thoughtful space.
        </p>
      </div>
      <div
        className="concept concept-understand"
        aria-label="Concept preview of translations and sources"
      >
        <div className="concept-heading label">
          <span>Layers of meaning</span>
          <span className="concept-tag">Concept preview</span>
        </div>
        <ArabicVerse text="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا" />
        <Tabs
          ariaLabel="Explore verse information"
          items={TAB_ITEMS}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>
    </article>
  )
}

export default UnderstandChapter
