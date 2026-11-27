import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import type { DuaHadithCategory, DuaHadithTopic } from '@/@types/quran'
import SubpageLayout from '@/components/layouts/SubpageLayout'
import { DUA_HADITH_CATALOG } from '@/data/duaHadithCatalog'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { toggleEntryBookmark } from '@/store/slices/base/studySlice'
import { cn } from '@/utils/classNames'

const TOPICS: Array<'All' | DuaHadithTopic> = [
  'All',
  'Knowledge',
  'Patience',
  'Gratitude',
  'Forgiveness',
  'Daily Remembrance',
  'Character',
]

export function DuaHadithView() {
  const dispatch = useAppDispatch()
  const bookmarkedIds = useAppSelector((state) => state.study.bookmarkedEntries)
  const { key: locationKey } = useLocation()
  const [searchParams] = useSearchParams()
  const rawCategory = searchParams.get('category')
  const urlCategory: 'all' | DuaHadithCategory | 'saved' =
    rawCategory === 'dua' || rawCategory === 'hadith' || rawCategory === 'saved'
      ? rawCategory
      : 'all'

  const [categoryFilter, setCategoryFilter] = useState<'all' | DuaHadithCategory | 'saved'>(
    urlCategory,
  )

  useEffect(() => {
    setCategoryFilter(urlCategory)
  }, [urlCategory, locationKey])
  const [topicFilter, setTopicFilter] = useState<'All' | DuaHadithTopic>('All')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return DUA_HADITH_CATALOG.filter((item) => {
      if (categoryFilter === 'saved' && !bookmarkedIds.includes(item.id)) return false
      if ((categoryFilter === 'dua' || categoryFilter === 'hadith') && item.category !== categoryFilter) {
        return false
      }
      if (topicFilter !== 'All' && item.topic !== topicFilter) return false
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.arabic.includes(q)
      )
    })
  }, [bookmarkedIds, categoryFilter, search, topicFilter])

  const resetFilters = () => {
    setCategoryFilter('all')
    setTopicFilter('All')
    setSearch('')
  }

  const handleCopy = async (id: string, title: string, arabic: string, translation: string, source: string) => {
    try {
      await navigator.clipboard.writeText(`${title}\n${arabic}\n${translation}\n[${source}]`)
      setCopiedId(id)
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500)
    } catch {
      /* Ignore clipboard errors */
    }
  }

  return (
    <SubpageLayout shellClassName="dua-hadith-shell">
      <div className="subpage-topbar">
          <Link to="/get-started" className="back-link">
            <span aria-hidden="true">←</span> Back to Explore
          </Link>
          <Link to="/assistant" className="topbar-secondary-link">
            Ask the Assistant ↗
          </Link>
        </div>

        <header className="tool-header">
          <div>
            <p className="label subpage-kicker">Sunnah & Supplications</p>
            <h1 className="subpage-title">
              Authentic <em>Dua & Hadith</em>
            </h1>
            <p className="tool-meta">
              Source-cited Prophetic narrations and Qur’anic supplications for daily reflection.
            </p>
          </div>
        </header>

        <section className="filter-toolbar" aria-label="Filter Dua and Hadith collection">
          <div className="pill-toggle-group" role="tablist" aria-label="Collection category">
            {[
              { id: 'all', label: `All (${DUA_HADITH_CATALOG.length})` },
              { id: 'dua', label: 'Duas' },
              { id: 'hadith', label: 'Sahih Hadith' },
              { id: 'saved', label: `Saved (${bookmarkedIds.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={categoryFilter === tab.id}
                className={cn('pill-btn', categoryFilter === tab.id && 'is-active')}
                onClick={() => setCategoryFilter(tab.id as typeof categoryFilter)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="search"
            className="editorial-search"
            placeholder="Search by theme, text, or citation (e.g. Bukhari, patience)…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search Dua and Hadith"
          />
        </section>

        <div className="topic-chip-row" aria-label="Filter by topic">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className={cn('topic-chip', topicFilter === topic && 'is-active')}
              onClick={() => setTopicFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="state-card">
            <h2>No entries match these filters</h2>
            <p>Try clearing your search term or switching back to all topics.</p>
            <button type="button" className="solid-btn-inline" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <ul className="dua-grid">
            {filtered.map((item) => {
              const saved = bookmarkedIds.includes(item.id)
              return (
                <li key={item.id} className="dua-card">
                  <div className="ayah-card-meta">
                    <span className="ayah-ref-pill">
                      {item.category === 'dua' ? 'Dua' : 'Hadith'} · {item.topic}
                    </span>
                    <div className="ayah-card-actions">
                      <button
                        type="button"
                        className="mini-action-btn"
                        onClick={() =>
                          void handleCopy(
                            item.id,
                            item.title,
                            item.arabic,
                            item.translation,
                            item.source,
                          )
                        }
                      >
                        {copiedId === item.id ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        type="button"
                        className={cn('mini-action-btn', saved && 'is-saved')}
                        onClick={() => dispatch(toggleEntryBookmark(item.id))}
                        aria-pressed={saved}
                      >
                        {saved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>

                  <h2 className="dua-card-title">{item.title}</h2>
                  <p className="arabic dua-card-arabic" lang="ar" dir="rtl">
                    {item.arabic}
                  </p>
                  <p className="dua-card-translit">{item.transliteration}</p>
                  <p className="dua-card-translation">{item.translation}</p>

                  <div className="dua-card-footer">
                    <span className="source-label">{item.source}</span>
                    <span className="authenticity-tag">{item.authenticity}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
    </SubpageLayout>
  )
}

export default DuaHadithView
