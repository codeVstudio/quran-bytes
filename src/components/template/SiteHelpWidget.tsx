import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import type { HelpAnswerRule, HelpMessage } from '@/@types/quran'
import SvgIcon from '@/components/shared/SvgIcon'
import { normalizeQuery } from '@/utils/normalizeQuery'

const ANSWERS: HelpAnswerRule[] = [
  {
    id: 'rulings',
    match: /fatwa|halal|haram|ruling|permissib|divorce|حلال|حرام|فتوى/,
    text: 'I’m a guide to this website, not a scholar or a source of religious rulings. Please take personal religious questions to a qualified scholar. I can help you find the learning previews and their references.',
    link: ['Explore the learning previews', '#explore'],
  },
  {
    id: 'guide',
    match:
      /\bai\b|chatgpt|\bgpt\b|\bllm\b|artificial intelligence|what.*model|who.*you|real.*bot|are.*human/,
    text: 'I’m the on-device Quran Bytes site guide, not a live AI model or a person. I can answer project questions and help with follow-ups using the information on this page. Your questions aren’t sent to an AI provider.',
  },
  {
    id: 'privacy',
    match: /privacy|private|data|stored|saved|record|personal/,
    text: 'This guide answers locally in your browser. Your questions aren’t sent to a server or saved when you leave. The launch-update and contribution forms are also previews: they don’t send or save your details yet.',
  },
  {
    id: 'free',
    match: /free|cost|price|\bpay\b|advertis|open code|مجاني/,
    text: 'Quran Bytes is intended to be free, open-source, and ad-free. The project’s mission is learning without ads or paywalls.',
    link: ['Read the vision', '#vision'],
  },
  {
    id: 'launch',
    match: /launch|\blive\b|ready|available|release|notif|updates?|early|join|email|sign.?up/,
    text: 'Quran Bytes isn’t live yet. The learning interfaces are concept previews and the features are planned. You can find the launch-updates form at the bottom of the page, but sign-up is not connected yet, so no email will be sent or saved.',
    link: ['Find launch updates', '#get-involved'],
  },
  {
    id: 'contribute',
    match:
      /contribut|volunteer|\bdesign(?:ers?|ing)?\b|\bdevelopers?\b|\breviewers?\b|content review|educator|skills|how can i help|i want to help|help.*build|join.*team|github|repository/,
    text: 'Developers, designers, translators, educators, and content reviewers are welcome. Use “Contribute your skills” to explore the interest form. It’s a front-end preview for now, and the official repository link hasn’t been provided yet.',
    link: ['Get involved', '#get-involved'],
  },
  {
    id: 'sources',
    match:
      /source|reference|translat|tafsir|meaning|verse|ayah|muzzammil|73.?4|language|urdu|bengali|indonesian|مصدر|ترجمة/,
    text: 'The reading preview uses an excerpt from Surah Al-Muzzammil 73:4, with an English translation excerpt attributed to Saheeh International. Open “Source notes” in the Understand section for the details. Tafsir and additional languages are planned.',
    link: ['Explore meaning and sources', '#understand'],
  },
  {
    id: 'memorize',
    match: /hifz|memori|repeat|revis|hidden|covered|mask|حفظ|مراجعة/,
    text: 'In the Memorize preview, select the covered word to reveal it, hide it again to test recall, and use the arrow to mark a repetition. Three marks complete the practice loop. Full hifz tools and revision scheduling are planned; this preview doesn’t save progress.',
    link: ['Try memorization practice', '#memorize'],
  },
  {
    id: 'practice',
    match: /dua|duas|hadith|daily|sunnah|دعاء|حديث/,
    text: 'The Practice preview has Dua and Hadith tabs. The sample dua cites Sunan Ibn Majah 251; the hadith about learning and teaching the Qur’an cites Sahih al-Bukhari 5027. Daily learning tools and structured learning paths are planned.',
    link: ['Open daily practice', '#practice'],
  },
  {
    id: 'audio',
    match: /recit|\baudio\b|\bplay\b|listen|\bsound\b/,
    text: 'The play control demonstrates a recitation waveform visually; it does not play audio. You can try the speed control and translation toggle. Real recitation audio is planned.',
    link: ['Try the reading preview', '#read'],
  },
  {
    id: 'accessibility',
    match: /scroll|slow|lag|motion|accessib|keyboard|animation|loader/,
    text: 'The page uses normal browser scrolling, with no pinned chapters or delayed smoothing. The intro finishes in under 2 seconds, and refreshing returns you to the hero. Reduced-motion preferences disable the intro and decorative motion.',
  },
  {
    id: 'reading',
    match: /\bread(?:ing)?\b|\bquran\b|qur an|قرآن|قراءة/,
    text: 'The Read section previews a quiet Arabic reading view with an English translation and visual recitation controls. The text shown is an excerpt of Al-Muzzammil 73:4. The complete reading platform is planned.',
    link: ['Begin with an ayah', '#read'],
  },
  {
    id: 'overview',
    match: /learn|feature|platform|about|offer|what.*can|what.*bytes/,
    text: 'Quran Bytes is a free, open-source Islamic learning project. Planned features include Qur’an reading, hifz practice, translations and sources, hadith, duas, and structured learning. This page lets you try a few concept interfaces.',
    link: ['Explore the previews', '#explore'],
  },
  {
    id: 'greeting',
    match: /salaam|salam|assalamu|\bhello\b|\bhi\b|السلام/,
    text: 'Wa alaikum assalam, and welcome. I can help with Quran Bytes, its planned learning features, sources, or getting involved. What would you like to know?',
  },
]

const DETAILS: Record<string, string> = {
  reading:
    'Sure — open the Read preview to see the ayah and its English translation. “Aa” toggles the translation, the arrow control previews a recitation waveform, and the speed button cycles through playback speeds. The waveform is visual only; audio is planned.',
  memorize:
    'Here’s a quick way to try it:\n1. Read the verse once.\n2. Select the covered word to reveal it, then hide it again.\n3. Recall the word and mark a repetition with the arrow.\n\nThree marks complete a loop. This demo doesn’t save progress.',
  sources:
    'The sample is an excerpt from Al-Muzzammil 73:4. Its English translation excerpt is attributed to Saheeh International. In Understand, switch to “Source notes” to see the attribution beside the original. Tafsir sources and more languages are still to be confirmed.',
  practice:
    'You can switch between Dua and Hadith in the Practice preview. The dua for beneficial knowledge references Sunan Ibn Majah 251. The hadith about learning and teaching the Qur’an references Sahih al-Bukhari 5027.',
  contribute:
    'You can help with development, design, translation, education, or content review. Open “Contribute your skills,” choose the areas that fit you, and explore the interest form. It is not connected yet, so no details are submitted.',
  launch:
    'There isn’t a confirmed launch date yet. The launch-updates form is a front-end preview, not an active mailing list. When a signup service is connected, the page can collect opt-in updates; right now it sends and saves nothing.',
  free: 'The intention is simple: free access, open-source development, clear sources, and community support. No advertising or learning paywalls are planned. You can read those commitments in the Vision section.',
  audio:
    'The control lets you try the interface rather than listen to a recording. Select play to animate the waveform, cycle the speed button, or toggle the translation. No sound is currently played.',
  privacy:
    'The conversation exists only in this tab and is cleared on refresh or when you start a new chat. Matching happens locally, with no AI service receiving your messages. The two interest forms are also unconnected previews.',
  overview:
    'You can explore four connected ideas: Read, Memorize, Understand, and Practice. Each section has a small interactive concept. Full Qur’an reading, revision tools, additional languages, hadith, duas, and structured learning are planned.',
  guide:
    'I use a small, built-in knowledge base and the topic of our current conversation to answer follow-up questions. I’m not a generative model, so I’ll say when something is outside my scope rather than inventing an answer.',
  accessibility:
    'The intro finishes automatically in under 2 seconds. Outside that intro, scrolling is fully native. Buttons and tabs support keyboard navigation, Enter sends chat messages, Shift+Enter adds a line, and reduced motion disables decorative animations.',
}

const FOLLOW_UPS: Record<string, string[]> = {
  reading: ['Is there audio?', 'Where are the sources?'],
  memorize: ['How does it work?', 'Is my progress saved?'],
  sources: ['Tell me more', 'What about memorization?'],
  practice: ['Tell me more', 'Where are the sources?'],
  contribute: ['Which skills can I contribute?', 'Is there a repository?'],
  launch: ['Is there a launch date?', 'How can I contribute?'],
  free: ['How can I contribute?', 'What can I learn?'],
  audio: ['Try reading', 'What about memorization?'],
  privacy: ['Are you a real AI?', 'What can I learn?'],
  guide: ['What can I learn?', 'How do I memorize?'],
}

const INITIAL_GREETING: HelpMessage = {
  id: 'welcome-0',
  fromGuide: true,
  text: 'Assalamu alaikum. What would you like to explore?',
  welcomeNote:
    'I can help with reading, hifz, sources, and getting involved. You can ask follow-up questions, too.',
}

const INITIAL_SUGGESTIONS = [
  { label: 'Explore features', question: 'What can I learn?' },
  { label: 'Try hifz', question: 'How do I memorize?' },
  { label: 'Get involved', question: 'How can I contribute?' },
]

export function SiteHelpWidget() {
  const widgetRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const questionRef = useRef<HTMLTextAreaElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lastTopic, setLastTopic] = useState<string | null>(null)
  const [messages, setMessages] = useState<HelpMessage[]>([INITIAL_GREETING])
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const getTopic = (id: string) => ANSWERS.find((item) => item.id === id)

  const resolve = useCallback(
    (text: string): { id: string; text: string; link?: [string, string] } => {
      const normalized = normalizeQuery(text)
      if (/^(thank(?:s| you)|jazakallah(?: khair)?|جزاك الله خيرا)[.!?\s]*$/.test(normalized)) {
        return {
          id: lastTopic ?? 'overview',
          text: 'You’re very welcome. If you’d like, we can explore another part of Quran Bytes together.',
        }
      }
      if (lastTopic === 'memorize' && /progress|saved|stored/.test(normalized)) {
        const memTopic = getTopic('memorize')
        return {
          id: memTopic?.id ?? 'memorize',
          link: memTopic?.link,
          text: 'Not in this preview — your repetition count only lasts while this page is open. Accounts, saved progress, and revision scheduling aren’t connected yet. You can still try the hidden-word practice and repetition loop here.',
        }
      }
      const direct = ANSWERS.find(
        (item) =>
          ['rulings', 'guide', 'privacy', 'free'].includes(item.id) && item.match.test(normalized),
      )
      if (direct) return direct

      if (
        lastTopic &&
        /^(?:tell me more|more(?: please)?|go on|explain(?: more)?|how(?: does| do)? (?:it|that|this) work|how do i (?:try|use) it|can i try it)[.!?\s]*$/.test(
          normalized,
        )
      ) {
        const topic = getTopic(lastTopic)
        return {
          id: lastTopic,
          link: topic?.link,
          text: DETAILS[lastTopic] ?? topic?.text ?? '',
        }
      }

      const ranked = ANSWERS.map((item) => {
        const match = normalized.match(item.match)
        return { item, score: match ? match[0].length + (item.id === lastTopic ? 1 : 0) : 0 }
      })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)

      if (ranked.length) {
        const topic = ranked[0].item
        return topic.id === lastTopic && DETAILS[topic.id]
          ? { ...topic, text: DETAILS[topic.id] }
          : topic
      }

      return {
        id: 'unknown',
        text: 'That’s outside my site knowledge, and I don’t want to guess. I can help with Quran Bytes, reading, hifz, sources, launch updates, and contributing. For religious rulings or personal guidance, please speak with a qualified scholar.',
      }
    },
    [lastTopic],
  )

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

  const resizeComposer = (el: HTMLTextAreaElement) => {
    if (!open) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`
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

    if (!['unknown', 'greeting', 'rulings'].includes(response.id)) {
      setLastTopic(response.id)
    }
    const prompts = FOLLOW_UPS[response.id] ?? ['What can I learn?', 'How can I contribute?']
    setSuggestions(prompts.map((p) => ({ label: p, question: p })))
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

  const handleReset = () => {
    setLastTopic(null)
    setMessages([INITIAL_GREETING])
    setInput('')
    setSuggestions(
      (FOLLOW_UPS.overview ?? ['What can I learn?', 'How can I contribute?']).map((p) => ({
        label: p,
        question: p,
      })),
    )
    if (questionRef.current) {
      questionRef.current.style.height = 'auto'
      questionRef.current.focus({ preventScroll: true })
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
              <p>Your on-device site guide</p>
            </div>
          </div>
          <div className="help-header-actions">
            <button
              className="help-icon-button"
              id="help-reset"
              type="button"
              aria-label="Start a new conversation"
              title="New conversation"
              onClick={handleReset}
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
                  <a href={msg.link[1]} onClick={() => closePanel(false)}>
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
          {suggestions.map((s) => (
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
              resizeComposer(event.currentTarget)
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
            Local site guide, not a live AI model. Your messages stay here.
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
