import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { SurahMeta, SurahWithTranslation } from '@/@types/quran'
import Footer from '@/components/template/Footer'
import { fetchAllSurahs, fetchSurahAudioUrls, fetchSurahContent } from '@/services/quranApi'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setLastReadSurah, toggleAyahBookmark } from '@/store/slices/base/studySlice'
import { cn } from '@/utils/classNames'

type FontSizeOption = 'sm' | 'md' | 'lg'

export function ReadQuranView() {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const lastReadSurah = useAppSelector((state) => state.study.lastReadSurah)
  const bookmarkedAyahs = useAppSelector((state) => state.study.bookmarkedAyahs)

  const initialSurah = Number(searchParams.get('surah')) || lastReadSurah || 1
  const [surahNumber, setSurahNumber] = useState<number>(
    initialSurah >= 1 && initialSurah <= 114 ? initialSurah : 1,
  )
  const [surahs, setSurahs] = useState<SurahMeta[]>([])
  const [surahData, setSurahData] = useState<SurahWithTranslation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState<FontSizeOption>('md')
  const [focusMode, setFocusMode] = useState(false)
  const [showTranslation, setShowTranslation] = useState(true)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioUrls, setAudioUrls] = useState<string[]>([])
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null)
  const [audioStatus, setAudioStatus] = useState<string | null>(null)

  const loadSurah = useCallback(
    async (num: number) => {
      setLoading(true)
      setError(null)
      setActiveAudioIndex(null)
      setAudioStatus(null)
      audioRef.current?.pause()

      try {
        const [{ surahs: directory }, content] = await Promise.all([
          fetchAllSurahs(),
          fetchSurahContent(num, 'en.sahih'),
        ])
        setSurahs(directory)
        setSurahData(content)
        dispatch(setLastReadSurah(num))
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load this Surah right now. Please check your connection and retry.',
        )
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  useEffect(() => {
    void loadSurah(surahNumber)
  }, [loadSurah, surahNumber])

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
    }
  }, [])

  const selectSurah = (num: number) => {
    const valid = Math.max(1, Math.min(114, num))
    setSurahNumber(valid)
    setSearchParams({ surah: String(valid) }, { replace: true })
    setSearchQuery('')
  }

  const handleToggleRecitation = async (index = 0) => {
    if (activeAudioIndex === index) {
      audioRef.current?.pause()
      setActiveAudioIndex(null)
      setAudioStatus('Recitation paused.')
      return
    }

    try {
      setAudioStatus('Loading recitation audio…')
      const urls = audioUrls.length === surahData?.ayahs.length
        ? audioUrls
        : await fetchSurahAudioUrls(surahNumber)
      setAudioUrls(urls)

      const url = urls[index]
      if (!url) {
        setAudioStatus('Audio unavailable for this verse offline.')
        return
      }

      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const player = audioRef.current
      player.src = url
      player.onended = () => {
        if (index + 1 < urls.length) {
          void handleToggleRecitation(index + 1)
        } else {
          setActiveAudioIndex(null)
          setAudioStatus('Surah recitation complete.')
        }
      }
      player.onerror = () => {
        setActiveAudioIndex(null)
        setAudioStatus('Audio stream unavailable right now.')
      }

      await player.play()
      setActiveAudioIndex(index)
      setAudioStatus(`Playing Ayah ${index + 1} · Mishary Alafasy`)
    } catch {
      setActiveAudioIndex(null)
      setAudioStatus('Unable to play audio stream in this browser.')
    }
  }

  const filteredAyahs = useMemo(() => {
    if (!surahData) return []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return surahData.ayahs
    return surahData.ayahs.filter(
      (ayah) =>
        ayah.arabic.includes(q) ||
        ayah.translation?.toLowerCase().includes(q) ||
        String(ayah.numberInSurah) === q,
    )
  }, [searchQuery, surahData])

  const bookmarkCountInSurah = useMemo(() => {
    if (!surahData) return 0
    return surahData.ayahs.filter((a) =>
      bookmarkedAyahs.includes(`${surahData.meta.number}:${a.numberInSurah}`),
    ).length
  }, [bookmarkedAyahs, surahData])

  return (
    <main id="main" className={cn('subpage-shell reader-shell', focusMode && 'is-focus-mode')}>
      <div className="subpage-container">
        <div className="subpage-topbar">
          <Link to="/get-started" className="back-link">
            <span aria-hidden="true">←</span> Back to Explore
          </Link>
          <Link to={`/translation?surah=${surahNumber}`} className="topbar-secondary-link">
            Open Translation View ↗
          </Link>
        </div>

        <header className="tool-header">
          <div>
            <p className="label subpage-kicker">Read Qur’an</p>
            <h1 className="subpage-title">
              {surahData ? (
                <>
                  {surahData.meta.englishName}{' '}
                  <em>— {surahData.meta.englishNameTranslation}</em>
                </>
              ) : (
                <>
                  Read <em>the Qur’an</em>
                </>
              )}
            </h1>
            {surahData && (
              <p className="tool-meta">
                Surah {surahData.meta.number} of 114 · {surahData.meta.revelationType} ·{' '}
                {surahData.meta.numberOfAyahs} Ayahs
                {bookmarkCountInSurah > 0 ? ` · ${bookmarkCountInSurah} bookmarked` : ''}
                {surahData.isFallback ? ' · Offline excerpt' : ''}
              </p>
            )}
          </div>

          {!loading && surahData && (
            <div className="tool-controls">
              <div className="control-group">
                <label className="sr-only" htmlFor="reader-surah-select">
                  Choose Surah
                </label>
                <select
                  id="reader-surah-select"
                  className="editorial-select"
                  value={surahNumber}
                  onChange={(e) => selectSurah(Number(e.target.value))}
                >
                  {(surahs.length ? surahs : [surahData.meta]).map((item) => (
                    <option key={item.number} value={item.number}>
                      {item.number}. {item.englishName} ({item.englishNameTranslation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pill-toggle-group" role="group" aria-label="Arabic size">
                {(['sm', 'md', 'lg'] as FontSizeOption[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={cn('pill-btn', fontSize === size && 'is-active')}
                    onClick={() => setFontSize(size)}
                    aria-pressed={fontSize === size}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={cn('pill-btn', showTranslation && 'is-active')}
                onClick={() => setShowTranslation((prev) => !prev)}
                aria-pressed={showTranslation}
              >
                Translation
              </button>

              <button
                type="button"
                className={cn('pill-btn', focusMode && 'is-active')}
                onClick={() => setFocusMode((prev) => !prev)}
                aria-pressed={focusMode}
              >
                Focus
              </button>

              <button
                type="button"
                className={cn('pill-btn pill-btn-primary', activeAudioIndex !== null && 'is-active')}
                onClick={() => void handleToggleRecitation(activeAudioIndex ?? 0)}
              >
                {activeAudioIndex !== null ? 'Pause Audio' : 'Listen'}
              </button>
            </div>
          )}
        </header>

        {audioStatus && (
          <p className="tool-status-banner" role="status">
            {audioStatus}
          </p>
        )}

        {loading && (
          <div className="state-card" role="status" aria-busy="true">
            <span className="state-spinner" aria-hidden="true" />
            <p>Loading Surah {surahNumber}…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-card state-card-error" role="alert">
            <h2>Could not load Surah {surahNumber}</h2>
            <p>{error}</p>
            <div className="state-actions">
              <button type="button" className="solid-btn-inline" onClick={() => void loadSurah(surahNumber)}>
                Try Again
              </button>
              <button type="button" className="pill-btn" onClick={() => selectSurah(1)}>
                Open Al-Fatihah (Offline Ready)
              </button>
            </div>
          </div>
        )}

        {!loading && !error && surahData && (
          <>
            <div className="reader-filter-bar">
              <input
                type="search"
                className="editorial-search"
                placeholder="Filter ayahs by number or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter ayahs in this Surah"
              />
              <div className="surah-nav-buttons">
                <button
                  type="button"
                  className="pill-btn"
                  disabled={surahNumber <= 1}
                  onClick={() => selectSurah(surahNumber - 1)}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className="pill-btn"
                  disabled={surahNumber >= 114}
                  onClick={() => selectSurah(surahNumber + 1)}
                >
                  Next →
                </button>
              </div>
            </div>

            {surahData.meta.number !== 1 && surahData.meta.number !== 9 && !searchQuery && (
              <p className="bismillah-banner arabic" lang="ar" dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            )}

            {filteredAyahs.length === 0 ? (
              <div className="state-card">
                <p>No ayahs match “{searchQuery}” in {surahData.meta.englishName}.</p>
                <button type="button" className="pill-btn" onClick={() => setSearchQuery('')}>
                  Clear Filter
                </button>
              </div>
            ) : (
              <ol className={cn('ayah-list', `ayah-font-${fontSize}`)}>
                {filteredAyahs.map((ayah, idx) => {
                  const bookmarkKey = `${surahData.meta.number}:${ayah.numberInSurah}`
                  const isBookmarked = bookmarkedAyahs.includes(bookmarkKey)
                  const isPlaying = activeAudioIndex === idx

                  return (
                    <li
                      key={ayah.number}
                      className={cn('ayah-card', isPlaying && 'is-playing')}
                    >
                      <div className="ayah-card-meta">
                        <span className="ayah-ref-pill">
                          {surahData.meta.number}:{ayah.numberInSurah}
                        </span>
                        <div className="ayah-card-actions">
                          <button
                            type="button"
                            className="mini-action-btn"
                            onClick={() => void handleToggleRecitation(idx)}
                            aria-label={`Play ayah ${ayah.numberInSurah}`}
                          >
                            {isPlaying ? 'Pause' : 'Play'}
                          </button>
                          <button
                            type="button"
                            className={cn('mini-action-btn', isBookmarked && 'is-saved')}
                            onClick={() => dispatch(toggleAyahBookmark(bookmarkKey))}
                            aria-pressed={isBookmarked}
                          >
                            {isBookmarked ? 'Saved' : 'Bookmark'}
                          </button>
                        </div>
                      </div>
                      <p className="arabic ayah-arabic-text" lang="ar" dir="rtl">
                        {ayah.arabic}
                      </p>
                      {showTranslation && ayah.translation && (
                        <p className="ayah-translation-text">{ayah.translation}</p>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </>
        )}

        <Footer />
      </div>
    </main>
  )
}

export default ReadQuranView
