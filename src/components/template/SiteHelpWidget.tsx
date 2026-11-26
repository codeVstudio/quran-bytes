import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { HelpAnswerRule, HelpMessage } from '@/@types/quran'
import SvgIcon from '@/components/shared/SvgIcon'
import { normalizeQuery } from '@/utils/normalizeQuery'

const ANSWERS: HelpAnswerRule[] = [
  {
    id: 'rulings',
    match: /fatwa|halal|haram|ruling|permissib|divorce|حلال|حرام|فتوى/,
    text: 'I’m a guide to this website, not a scholar or a source of religious rulings. Please take personal religious questions to a qualified scholar. You can look up verses and authentic citations in our library.',
    link: ['Open Assistant', '/assistant'],
  },
  {
    id: 'guide',
    match:
      /\bai\b|chatgpt|\bgpt\b|\bllm\b|artificial intelligence|what.*model|who.*you|real.*bot|are.*human/,
    text: 'I’m the on-device Quran Bytes site guide. For searching Qur’an verses, translations, and cited Dua & Hadith topics, open the full-page AI Islamic Assistant.',
    link: ['Open AI Assistant', '/assistant'],
  },
  {
    id: 'reading',
    match: /\bread(?:ing)?\b|\bquran\b|qur an|قرآن|قراءة/,
    text: 'You can now read all 114 Surahs in Arabic with audio recitation controls and bookmarking in our distraction-free Qur’an Reader.',
    link: ['Start Reading', '/read'],
  },
  {
    id: 'sources',
    match: /source|reference|translat|tafsir|meaning|verse|ayah|muzzammil|73.?4|urdu|مصدر|ترجمة/,
    text: 'Explore Saheeh International, Yusuf Ali, Muhammad Asad, Pickthall, and Urdu translations across all 114 Surahs, including full-Qur’an keyword search.',
    link: ['Explore Translations', '/translation'],
  },
  {
    id: 'practice',
    match: /dua|duas|hadith|daily|sunnah|دعاء|حديث/,
    text: 'Browse authentic source-cited Duas and Sahih Hadith (Bukhari, Muslim, Ibn Majah, Tirmidhi) filterable by theme.',
    link: ['Open Dua & Hadith', '/dua-hadith'],
  },
  {
    id: 'memorize',
    match: /hifz|memori|repeat|revis|hidden|covered|mask|حفظ|مراجعة/,
    text: 'Try the hidden-word Hifz loop on the home page, or open the Qur’an Reader for distraction-free repetition and audio playback.',
    link: ['Open Get Started Paths', '/get-started'],
  },
  {
    id: 'login',
    match: /login|sign.?in|sign.?up|account|password|register/,
    text: 'Create an account, login, or reset your password cleanly using the Login flow.',
    link: ['Go to Login', '/login'],
  },
  {
    id: 'free',
    match: /free|cost|price|\bpay\b|advertis|open code|مجاني/,
    text: 'Quran Bytes is free, open-source, and ad-free by intention.',
    link: ['Get Started', '/get-started'],
  },
  {
    id: 'overview',
    match: /learn|feature|platform|about|offer|what.*can|what.*bytes/,
    text: 'Click Get Started to explore four paths: Read Quran, Quran Translation, Dua & Hadith, and AI Islamic Assistant.',
    link: ['Get Started', '/get-started'],
  },
  {
    id: 'greeting',
    match: /salaam|salam|assalamu|\bhello\b|\bhi\b|السلام/,
    text: 'Wa alaikum assalam, and welcome. What would you like to explore on Quran Bytes?',
    link: ['Choose a Path', '/get-started'],
  },
]

const INITIAL_GREETING: HelpMessage = {
  id: 'welcome-0',
  fromGuide: true,
  text: 'Assalamu alaikum. What would you like to explore?',
  welcomeNote:
    'Ask about reading Qur’an, translations, Dua & Hadith, your account, or open our dedicated AI Islamic Assistant.',
}

const INITIAL_SUGGESTIONS = [
  { label: 'Read Qur’an', question: 'How do I read Quran?' },
  { label: 'Translations', question: 'Where are the translations?' },
  { label: 'Ask Assistant', question: 'Open AI assistant' },
]

export function SiteHelpWidget() {
  const location = useLocation()
  const navigate = useNavigate()
  const widgetRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const questionRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<HelpMessage[]>([INITIAL_GREETING])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const syncHelpViewport = useCallback(() => {
    const widget = widgetRef.current
    if (!widget) return
    if (!open || !window.visualViewport) {
      widget.style.removeProperty('--help-vv-bottom')
      widget.style.removeProperty('--help-max-height')
      return
    }
    const vv = window.visualViewport
    const bottomInset = Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop)))
    const reservedChrome = vv.height < 520 ? 72 : 104
    const availableHeight = Math.max(180, Math.floor(vv.height - reservedChrome))
    widget.style.setProperty('--help-vv-bottom', `${bottomInset}px`)
    widget.style.setProperty('--help-max-height', `${availableHeight}px`)
  }, [open])

  useEffect(() => {
    syncHelpViewport()
    if (!window.visualViewport) {
      window.addEventListener('resize', syncHelpViewport, { passive: true })
      return () => window.removeEventListener('resize', syncHelpViewport)
    }
    const vv = window.visualViewport
    vv.addEventListener('resize', syncHelpViewport, { passive: true })
    vv.addEventListener('scroll', syncHelpViewport, { passive: true })
    window.addEventListener('resize', syncHelpViewport, { passive: true })
    return () => {
      vv.removeEventListener('resize', syncHelpViewport)
      vv.removeEventListener('scroll', syncHelpViewport)
      window.removeEventListener('resize', syncHelpViewport)
    }
  }, [syncHelpViewport])

  useEffect(() => {
    if (!open) return
    const q = questionRef.current
    if (q) {
      q.style.height = 'auto'
      q.style.height = `${Math.min(q.scrollHeight, 96)}px`
      q.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (open && widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  if (location.pathname === '/assistant') {
    return null
  }

  const resolve = (text: string): { id: string; text: string; link?: [string, string] } => {
    const normalized = normalizeQuery(text)
    const ranked = ANSWERS.map((item) => {
      const match = normalized.match(item.match)
      return { item, score: match ? match[0].length : 0 }
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)

    if (ranked.length) return ranked[0].item
    return {
      id: 'unknown',
      text: 'You can explore all learning paths from Get Started or ask deeper questions inside the AI Islamic Assistant.',
      link: ['Open Get Started', '/get-started'],
    }
  }

  const closePanel = (restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) {
      requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }))
    }
  }

  const answer = (value: string) => {
    const text = value.trim().slice(0, 500)
    if (!text) return
    const response = resolve(text)
    const now = Date.now()
    setMessages((prev) => {
      const next: HelpMessage[] = [
        ...prev,
        { id: `u-${now}`, fromGuide: false, text },
        { id: `g-${now + 1}`, fromGuide: true, text: response.text, link: response.link },
      ]
      return next.length > 25 ? next.slice(next.length - 25) : next
    })
    setInput('')
    if (questionRef.current) {
      questionRef.current.style.height = 'auto'
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    answer(input)
    questionRef.current?.focus({ preventScroll: true })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      if (input.trim()) {
        answer(input)
        questionRef.current?.focus({ preventScroll: true })
      }
    }
  }

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1600)
    } catch {
      /* Ignore clipboard denial */
    }
  }

  return (
    <aside
      ref={widgetRef}
      className="site-help"
      id="site-help"
      aria-label="Quran Bytes site help"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          closePanel(true)
        }
      }}
    >
      <section
        className="help-panel"
        id="help-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="help-title"
        hidden={!open}
      >
        <header className="help-header">
          <div className="help-identity">
            <span className="help-avatar" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <use href="#icon-star" />
              </svg>
            </span>
            <div>
              <h2 id="help-title">Quran Bytes</h2>
              <p>Quick navigation guide</p>
            </div>
          </div>
          <div className="help-header-actions">
            <button
              className="help-icon-button"
              id="help-reset"
              type="button"
              aria-label="Start a new conversation"
              title="New conversation"
              onClick={() => {
                setMessages([INITIAL_GREETING])
                setInput('')
              }}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button
              className="help-icon-button"
              id="help-close"
              type="button"
              aria-label="Close site help"
              onClick={() => closePanel(true)}
            >
              <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </header>

        <div
          ref={messagesRef}
          className="help-messages"
          id="help-messages"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label="Help conversation"
          tabIndex={0}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`help-message help-message-${msg.fromGuide ? 'guide' : 'you'}`}
            >
              {msg.fromGuide && (
                <span className="help-message-avatar" aria-hidden="true">
                  QB
                </span>
              )}
              <div className="help-bubble">
                <span className="help-speaker">
                  {msg.fromGuide ? 'Quran Bytes guide' : 'You'}
                </span>
                <p dir="auto">{msg.text}</p>
                {msg.welcomeNote && <p className="help-welcome-note">{msg.welcomeNote}</p>}
                {msg.link && (
                  <a
                    href={msg.link[1]}
                    onClick={(e) => {
                      e.preventDefault()
                      closePanel(false)
                      navigate(msg.link![1])
                    }}
                  >
                    {msg.link[0]} ↗
                  </a>
                )}
                {msg.fromGuide &&
                  msg.id !== 'welcome-0' &&
                  typeof navigator !== 'undefined' &&
                  'clipboard' in navigator && (
                    <button
                      type="button"
                      className="help-copy"
                      aria-label={copiedId === msg.id ? 'Reply copied' : 'Copy this reply'}
                      onClick={() => void handleCopy(msg.id, msg.text)}
                    >
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

        <div className="help-suggestions" id="help-suggestions" aria-label="Suggested questions">
          {INITIAL_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              data-question={s.question}
              onClick={() => answer(s.question)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form className="help-form" id="help-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="help-question">
            Ask a question about Quran Bytes
          </label>
          <textarea
            ref={questionRef}
            id="help-question"
            name="question"
            rows={1}
            dir="auto"
            placeholder="Ask a question…"
            maxLength={500}
            autoComplete="off"
            aria-describedby="help-composer-hint"
            required
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              const el = event.currentTarget
              el.style.height = 'auto'
              el.style.height = `${Math.min(el.scrollHeight, 96)}px`
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" aria-label="Send question" disabled={!input.trim()}>
            <SvgIcon name="icon-arrow" />
          </button>
        </form>

        <div className="help-footer">
          <span className="sr-only" id="help-composer-hint">
            Enter sends your question. Shift and Enter adds a new line.
          </span>
          <p className="help-privacy">
            On-device guide. Messages are never shared.
          </p>
        </div>
      </section>

      <button
        ref={toggleRef}
        className="help-launcher"
        id="help-toggle"
        type="button"
        aria-label="Ask the Quran Bytes site guide"
        aria-controls="help-panel"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M23 13.5a9.5 9.5 0 0 1-9.5 9.5c-1.5 0-3-.35-4.25-.95L4 24l1.9-5.25A9.5 9.5 0 1 1 23 13.5Z" />
          <path d="M9 11h9M9 15h6" />
        </svg>
      </button>
    </aside>
  )
}

export default SiteHelpWidget
