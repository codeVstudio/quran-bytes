import { useState } from 'react'
import Tabs, { type TabItem } from '@/components/ui/Tabs'

const PRACTICE_TABS: TabItem[] = [
  {
    id: 'dua',
    tabId: 'dua-tab',
    panelId: 'dua-panel',
    label: 'Dua',
    className: 'daily-panel',
    content: (
      <>
        <span className="label">For beneficial knowledge</span>
        <p className="arabic daily-arabic" lang="ar" dir="rtl">
          اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا
        </p>
        <p className="daily-translation">
          “O Allah, benefit me with what You have taught me, teach me what will benefit me, and
          increase me in knowledge.”
        </p>
        <span className="source-label">Sunan Ibn Majah 251 · excerpt</span>
      </>
    ),
  },
  {
    id: 'hadith',
    tabId: 'hadith-tab',
    panelId: 'hadith-panel',
    label: 'Hadith',
    className: 'daily-panel',
    content: (
      <>
        <span className="label">Learn, and pass it on</span>
        <p className="arabic daily-arabic" lang="ar" dir="rtl">
          خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
        </p>
        <p className="daily-translation">
          “The best among you are those who learn the Qur’an and teach it.”
        </p>
        <span className="source-label">Sahih al-Bukhari 5027</span>
      </>
    ),
  },
]

export function PracticeChapter() {
  const [activeTab, setActiveTab] = useState('dua')

  return (
    <article
      className="chapter chapter-practice chapter-reverse"
      id="practice"
      aria-labelledby="practice-title"
    >
      <div className="chapter-copy">
        <p className="chapter-kicker label">
          04 / Practice <span className="planned-inline">Planned</span>
        </p>
        <h2 id="practice-title">
          <span className="text-line">
            <span>Carry learning</span>
          </span>
          <span className="text-line">
            <span>
              <em>into your day.</em>
            </span>
          </span>
        </h2>
        <p className="chapter-description">
          Beyond the time you set aside. Small reminders, meaningful words, and learning that finds
          a place in everyday life.
        </p>
      </div>
      <div
        className="concept concept-practice"
        aria-label="Concept preview of daily duas and hadith"
      >
        <div className="concept-heading label">
          <span>A daily companion</span>
          <span className="concept-tag">Concept preview</span>
        </div>
        <div className="daily-heading">
          <svg className="daily-star" aria-hidden="true">
            <use href="#icon-star" />
          </svg>
          <span className="label">
            A little knowledge.
            <br />A lasting intention.
          </span>
        </div>
        <Tabs
          ariaLabel="Daily reading"
          items={PRACTICE_TABS}
          activeId={activeTab}
          onChange={setActiveTab}
        />
        <p className="concept-footnote">Sample content. Full sourcing will accompany launch.</p>
      </div>
    </article>
  )
}

export default PracticeChapter
