import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { AssistantMessage } from '@/@types/quran'
import SvgIcon from '@/components/shared/SvgIcon'
import Footer from '@/components/template/Footer'
import { resolveAssistantQuery } from './services/assistantEngine'

const STARTER_PROMPTS = [
  'Show Ayat al-Kursi (2:255)',
  'Dua for beneficial knowledge',
  'What does the Qur’an say about patience?',
  'Show Hadith about learning the Qur’an',
]

const WELCOME_MSG: AssistantMessage = {
  id: 'init-0',
  role: 'assistant',
  text: 'Assalamu alaikum. Ask for any Surah & ayah (like 2:255 or 73:4), search Qur’anic themes, or explore authentic Duas and Hadith.',
  links: [
    { label: 'Read Qur’an', to: '/read' },
    { label: 'Explore Translation', to: '/translation' },
    { label: 'Dua & Hadith', to: '/dua-hadith' },
  ],
}

export function AssistantView() {
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [messages, setMessages] = useState<AssistantMessage[]>([WELCOME_MSG])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendQuery = async (raw: string) => {
    const text = raw.trim().slice(0, 500)
    if (!text || loading) return

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    }
    setMessages((prev) => [...prev, userMsg])
    setQuestion('')
    setLoading(true)

    try {
      const reply = await resolveAssistantQuery(text)
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: reply.text,
          arabic: reply.arabic,
          reference: reply.reference,
          links: reply.links,
        },
      ])
    } finally {
      setLoading(false)
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void sendQuery(question)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void sendQuery(question)
    }
  }

  const handleCopy = async (id: string, msg: AssistantMessage) => {
    const content = [msg.arabic, msg.text, msg.reference].filter(Boolean).join('\n')
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1500)
    } catch {
      /* Ignore clipboard denial */
    }
  }

  return (
    <main id="main" className="subpage-shell assistant-shell">
      <div className="subpage-container">
        <div className="subpage-topbar">
          <Link to="/get-started" className="back-link">
            <span aria-hidden="true">←</span> Back to Explore
          </Link>
          <button
            type="button"
            className="pill-btn"
            onClick={() => {
              setMessages([WELCOME_MSG])
              setQuestion('')
            }}
          >
            New Conversation
          </button>
        </div>

        <header className="tool-header">
          <div>
            <p className="label subpage-kicker">AI Islamic Assistant</p>
            <h1 className="subpage-title">
              Ask, Search &amp; <em>Reflect</em>
            </h1>
            <p className="tool-meta">
              Searches Qur’an verses, Saheeh International translations, and cited Dua &amp; Hadith sources. Consult a scholar for personal rulings.
            </p>
          </div>
        </header>

        <section className="assistant-workspace" aria-label="Islamic study assistant conversation">
          <div ref={listRef} className="assistant-thread" role="log" aria-live="polite">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className={`assistant-bubble assistant-bubble-${msg.role}`}
              >
                <div className="assistant-bubble-head">
                  <span className="label">
                    {msg.role === 'assistant' ? 'Quran Bytes Assistant' : 'You'}
                  </span>
                  {msg.role === 'assistant' && msg.id !== 'init-0' && (
                    <button
                      type="button"
                      className="mini-action-btn"
                      onClick={() => void handleCopy(msg.id, msg)}
                    >
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>

                {msg.arabic && (
                  <p className="arabic assistant-arabic" lang="ar" dir="rtl">
                    {msg.arabic}
                  </p>
                )}

                <p className="assistant-body-text">{msg.text}</p>

                {msg.reference && <p className="source-label">{msg.reference}</p>}

                {msg.links && msg.links.length > 0 && (
                  <div className="assistant-links">
                    {msg.links.map((lnk) => (
                      <Link key={`${msg.id}-${lnk.to}`} to={lnk.to} className="topic-chip">
                        {lnk.label} ↗
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}

            {loading && (
              <div className="assistant-bubble assistant-bubble-assistant" role="status">
                <span className="label">Searching verified sources…</span>
              </div>
            )}
          </div>

          <div className="topic-chip-row assistant-prompts" aria-label="Example prompts">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="topic-chip"
                onClick={() => void sendQuery(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="assistant-composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="assistant-input">
              Ask about Qur’an, Hadith, Dua, or Islamic teachings
            </label>
            <textarea
              ref={inputRef}
              id="assistant-input"
              rows={2}
              dir="auto"
              placeholder="Ask about an ayah (e.g. 2:255), a theme like mercy, or a dua…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
            />
            <button
              type="submit"
              className="solid-btn-inline assistant-send-btn"
              disabled={loading || !question.trim()}
            >
              <span>Send</span>
              <SvgIcon name="icon-arrow" />
            </button>
          </form>
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default AssistantView
