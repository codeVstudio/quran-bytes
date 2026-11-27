import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { QuranSearchHit, SurahMeta, SurahWithTranslation } from '@/@types/quran'
import SubpageLayout from '@/components/layouts/SubpageLayout'
import { TRANSLATION_EDITIONS } from '@/data/quranFallback'
import {
  fetchAllSurahs,
  fetchSurahContent,
  searchQuranByKeyword,
} from '@/services/quranApi'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  setLastReadSurah,
  setPreferredEdition,
  toggleAyahBookmark,
} from '@/store/slices/base/studySlice'
import { cn } from '@/utils/classNames'

export function QuranTranslationView() {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const preferredEdition = useAppSelector((state) => state.study.preferredEdition)
  const lastReadSurah = useAppSelector((state) => state.study.lastReadSurah)
  const bookmarkedAyahs = useAppSelector((state) => state.study.bookmarkedAyahs)

  const initialSurah = Number(searchParams.get('surah')) || lastReadSurah || 1
  const [surahNumber, setSurahNumber] = useState(
    initialSurah >= 1 && initialSurah <= 114 ? initialSurah : 1,
  )
  const [editionId, setEditionId] = useState(searchParams.get('edition') || preferredEdition || 'en.sahih')
  const [surahs, setSurahs] = useState<SurahMeta[]>([])
  const [surahData, setSurahData] = useState<SurahWithTranslation | null>(null)
  const [showArabic, setShowArabic] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedRef, setCopiedRef] = useState<string | null>(null)

  const [globalQuery, setGlobalQuery] = useState('')
  const [globalResults, setGlobalResults] = useState<QuranSearchHit[] | null>(null)
  const [globalTotal, setGlobalTotal] = useState(0)
  const [searchingGlobal, setSearchingGlobal] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const loadTranslation = useCallback(
    async (num: number, edition: string) => {
      setLoading(true)
      setError(null)
      try {
        const [{ surahs: list }, content] = await Promise.all([
          fetchAllSurahs(),
          fetchSurahContent(num, edition),
        ])
        setSurahs(list)
        setSurahData(content)
        dispatch(setLastReadSurah(num))
        dispatch(setPreferredEdition(edition))
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load translation right now. Please try again.',
        )
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  useEffect(() => {
    void loadTranslation(surahNumber, editionId)
  }, [editionId, loadTranslation, surahNumber])

  const updateRouteParams = (nextSurah: number, nextEdition: string) => {
    setSurahNumber(nextSurah)
    setEditionId(nextEdition)
    setGlobalResults(null)
    setSearchParams({ surah: String(nextSurah), edition: nextEdition }, { replace: true })
  }

  const handleGlobalSearch = async (event: FormEvent) => {
    event.preventDefault()
    const clean = globalQuery.trim()
    if (!clean) {
      setGlobalResults(null)
      return
    }
    setSearchingGlobal(true)
    setGlobalError(null)
    try {
      const searchEdition = editionId.startsWith('en.') ? editionId : 'en.sahih'
      const { count, matches } = await searchQuranByKeyword(clean, searchEdition)
      setGlobalResults(matches)
      setGlobalTotal(count)
    } catch {
      setGlobalError('Could not search all 114 Surahs right now. Check connection or try another term.')
    } finally {
      setSearchingGlobal(false)
    }
  }

  const handleCopy = async (key: string, text: string, arabic: string) => {
    const payload = `${arabic}\n"${text}"\n(${surahData?.meta.englishName ?? ''} ${key} · ${surahData?.editionName ?? editionId})`
    try {
      await navigator.clipboard.writeText(payload)
      setCopiedRef(key)
      setTimeout(() => setCopiedRef((c) => (c === key ? null : c)), 1500)
    } catch {
      /* Ignore clipboard refusal */
    }
  }

  const currentEditionMeta = useMemo(
    () => TRANSLATION_EDITIONS.find((e) => e.id === editionId),
    [editionId],
  )

  return (
    <SubpageLayout shellClassName="translation-shell">
      <div className="subpage-topbar">
          <Link to="/get-started" className="back-link">
            <span aria-hidden="true">←</span> Back to Explore
          </Link>
          <Link to={`/read?surah=${surahNumber}`} className="topbar-secondary-link">
            Distraction-Free Reader ↗
          </Link>
        </div>

        <header className="tool-header">
          <div>
            <p className="label subpage-kicker">Qur’an Translation</p>
            <h1 className="subpage-title">
              Explore <em>the Meaning</em>
            </h1>
            <p className="tool-meta">
              {currentEditionMeta ? `${currentEditionMeta.language} · ${currentEditionMeta.label}` : editionId}
              {surahData?.isFallback ? ' · Offline fallback excerpt' : ''}
            </p>
          </div>

          <div className="tool-controls">
            <select
              aria-label="Select Surah"
              className="editorial-select"
              value={surahNumber}
              onChange={(e) => updateRouteParams(Number(e.target.value), editionId)}
            >
              {(surahs.length ? surahs : surahData ? [surahData.meta] : []).map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName} — {s.englishNameTranslation}
                </option>
              ))}
            </select>

            <select
              aria-label="Select translation edition"
              className="editorial-select"
              value={editionId}
              onChange={(e) => updateRouteParams(surahNumber, e.target.value)}
            >
              {TRANSLATION_EDITIONS.map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {ed.language} · {ed.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={cn('pill-btn', showArabic && 'is-active')}
              onClick={() => setShowArabic((prev) => !prev)}
              aria-pressed={showArabic}
            >
              Show Arabic
            </button>
          </div>
        </header>

        <form className="global-search-form" onSubmit={(e) => void handleGlobalSearch(e)}>
          <input
            type="search"
            className="editorial-search"
            placeholder="Search meaning across the entire Qur’an (e.g. mercy, patience, light)…"
            value={globalQuery}
            onChange={(e) => {
              setGlobalQuery(e.target.value)
              if (!e.target.value.trim()) setGlobalResults(null)
            }}
            aria-label="Search across all Qur'an translations"
          />
          <button type="submit" className="solid-btn-inline" disabled={searchingGlobal}>
            {searchingGlobal ? 'Searching…' : 'Search All'}
          </button>
          {globalResults !== null && (
            <button
              type="button"
              className="pill-btn"
              onClick={() => {
                setGlobalQuery('')
                setGlobalResults(null)
                setGlobalError(null)
              }}
            >
              Back to Surah
            </button>
          )}
        </form>

        {globalError && (
          <div className="state-card state-card-error" role="alert">
            <p>{globalError}</p>
          </div>
        )}

        {globalResults !== null ? (
          <section aria-label="Search results across the Qur'an">
            <p className="tool-status-banner">
              Showing {globalResults.length} of {globalTotal} matches for “{globalQuery}”
            </p>
            {globalResults.length === 0 ? (
              <div className="state-card">
                <p>No matching verses found for “{globalQuery}”. Try another keyword.</p>
              </div>
            ) : (
              <ul className="translation-list">
                {globalResults.map((hit) => (
                  <li key={`${hit.surahNumber}:${hit.numberInSurah}`} className="translation-card">
                    <div className="ayah-card-meta">
                      <span className="ayah-ref-pill">
                        {hit.surahEnglishName} · {hit.surahNumber}:{hit.numberInSurah}
                      </span>
                      <button
                        type="button"
                        className="mini-action-btn"
                        onClick={() => updateRouteParams(hit.surahNumber, editionId)}
                      >
                        Open Surah ↗
                      </button>
                    </div>
                    <p className="translation-lead-text">{hit.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            {loading && (
              <div className="state-card" role="status" aria-busy="true">
                <span className="state-spinner" aria-hidden="true" />
                <p>Loading Surah {surahNumber} translation…</p>
              </div>
            )}

            {!loading && error && (
              <div className="state-card state-card-error" role="alert">
                <h2>Could not load translation</h2>
                <p>{error}</p>
                <div className="state-actions">
                  <button
                    type="button"
                    className="solid-btn-inline"
                    onClick={() => void loadTranslation(surahNumber, editionId)}
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    className="pill-btn"
                    onClick={() => updateRouteParams(1, 'en.sahih')}
                  >
                    Load Al-Fatihah
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && surahData && (
              <ul className="translation-list">
                {surahData.ayahs.map((ayah) => {
                  const key = `${surahData.meta.number}:${ayah.numberInSurah}`
                  const isSaved = bookmarkedAyahs.includes(key)

                  return (
                    <li key={ayah.number} className="translation-card">
                      <div className="ayah-card-meta">
                        <span className="ayah-ref-pill">
                          {surahData.meta.englishName} · {key}
                        </span>
                        <div className="ayah-card-actions">
                          <button
                            type="button"
                            className="mini-action-btn"
                            onClick={() =>
                              void handleCopy(key, ayah.translation ?? '', ayah.arabic)
                            }
                          >
                            {copiedRef === key ? 'Copied' : 'Copy'}
                          </button>
                          <button
                            type="button"
                            className={cn('mini-action-btn', isSaved && 'is-saved')}
                            onClick={() => dispatch(toggleAyahBookmark(key))}
                            aria-pressed={isSaved}
                          >
                            {isSaved ? 'Saved' : 'Bookmark'}
                          </button>
                        </div>
                      </div>
                      {showArabic && (
                        <p className="arabic translation-arabic-text" lang="ar" dir="rtl">
                          {ayah.arabic}
                        </p>
                      )}
                      <p className="translation-lead-text">{ayah.translation}</p>
                      <span className="source-label">Translation: {surahData.editionName}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )}
    </SubpageLayout>
  )
}

export default QuranTranslationView
