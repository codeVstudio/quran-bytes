import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubpageLayout from '@/components/layouts/SubpageLayout'
import SvgIcon from '@/components/shared/SvgIcon'
import { submitContactMessage } from '@/services/contactService'
import { cn } from '@/utils/classNames'

interface InquiryChannel {
  id: string
  title: string
  subjectPreset: string
  description: string
}

const INQUIRY_CHANNELS: InquiryChannel[] = [
  {
    id: 'general',
    title: 'General enquiries',
    subjectPreset: 'General enquiry',
    description:
      'Questions about Quran Bytes, upcoming milestones, or how to navigate our learning tools.',
  },
  {
    id: 'feedback',
    title: 'Feedback and suggestions',
    subjectPreset: 'Feedback and suggestions',
    description:
      'Share thoughtful ideas on reading clarity, translations, usability, or accessibility.',
  },
  {
    id: 'technical',
    title: 'Technical issues',
    subjectPreset: 'Technical issue report',
    description:
      'Let us know if something behaves unexpectedly on your browser, screen size, or connection.',
  },
  {
    id: 'collaboration',
    title: 'Collaboration and contributions',
    subjectPreset: 'Collaboration and contributions',
    description:
      'Connect with us regarding software engineering, design, translation, or content review.',
  },
]

const contactSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, 'Please enter at least 2 characters for your full name.')
    .max(100, 'Full name cannot exceed 100 characters.')
    .required('Full name is required.'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address.')
    .max(254, 'Email address cannot exceed 254 characters.')
    .required('Email address is required.'),
  subject: Yup.string()
    .trim()
    .min(3, 'Subject must be at least 3 characters.')
    .max(140, 'Subject cannot exceed 140 characters.')
    .required('Subject is required.'),
  message: Yup.string()
    .trim()
    .min(10, 'Please share a message of at least 10 characters.')
    .max(2500, 'Message cannot exceed 2,500 characters.')
    .required('Message is required.'),
})

const LAST_SUBMISSION_STORAGE_KEY = 'qb_contact_last_sig_v1'
const DUPLICATE_COOLDOWN_MS = 60_000

export function ContactView() {
  const formMountedAtRef = useRef<number>(Date.now())
  const subjectInputRef = useRef<HTMLInputElement>(null)
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<{
    kind: 'success' | 'error'
    text: string
  } | null>(null)

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: contactSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      if (submitting) return
      setSubmitState(null)

      if (honeypot.trim().length > 0) {
        setSubmitState({
          kind: 'error',
          text: 'Your submission could not be verified. Please refresh the page and try again.',
        })
        return
      }

      const normalized = {
        fullName: values.fullName.trim(),
        email: values.email.trim().toLowerCase(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      }

      const signature = `${normalized.email}::${normalized.subject.toLowerCase()}::${normalized.message}`
      try {
        const rawLast = sessionStorage.getItem(LAST_SUBMISSION_STORAGE_KEY)
        if (rawLast) {
          const parsed = JSON.parse(rawLast) as { signature?: string; timestamp?: number }
          if (
            parsed.signature === signature &&
            typeof parsed.timestamp === 'number' &&
            Date.now() - parsed.timestamp < DUPLICATE_COOLDOWN_MS
          ) {
            setSubmitState({
              kind: 'error',
              text: 'This message was already submitted moments ago. Please modify it or wait before sending again.',
            })
            return
          }
        }
      } catch {
        /* Ignore storage restrictions */
      }

      setSubmitting(true)
      try {
        const result = await submitContactMessage({
          fullName: normalized.fullName,
          email: normalized.email,
          subject: normalized.subject,
          message: normalized.message,
          website: honeypot,
          elapsedMs: Date.now() - formMountedAtRef.current,
        })

        try {
          sessionStorage.setItem(
            LAST_SUBMISSION_STORAGE_KEY,
            JSON.stringify({ signature, timestamp: Date.now() }),
          )
        } catch {
          /* Ignore storage restrictions */
        }

        helpers.resetForm()
        formMountedAtRef.current = Date.now()
        setSubmitState({
          kind: 'success',
          text: `Thank you, ${normalized.fullName}. ${result.message}`,
        })
      } catch (err) {
        setSubmitState({
          kind: 'error',
          text:
            err instanceof Error
              ? err.message
              : 'Something went wrong while sending your message. Please try again.',
        })
      } finally {
        setSubmitting(false)
      }
    },
  })

  const selectChannelTopic = (preset: string) => {
    void formik.setFieldValue('subject', preset, true)
    setSubmitState(null)
    subjectInputRef.current?.focus({ preventScroll: false })
  }

  return (
    <SubpageLayout shellClassName="editorial-page-shell contact-shell">
      <div className="subpage-topbar">
        <Link to="/" className="back-link">
          <span aria-hidden="true">←</span> Back to Home
        </Link>
        <Link to="/get-started" className="topbar-secondary-link">
          Explore Quran Bytes ↗
        </Link>
      </div>

      <header className="editorial-hero">
        <p className="label subpage-kicker">Contact Us</p>
        <h1 className="subpage-title">
          Let’s <em>connect.</em>
        </h1>
        <p className="subpage-subtitle editorial-lead">
          Have a question, suggestion, idea or something you’d like to share? We’d be happy to
          hear from you.
        </p>
      </header>

      <section className="contact-layout" aria-label="Contact form and inquiry guidance">
        <div className="contact-form-card">
          <div className="contact-card-header">
            <h2 className="contact-card-title">Send a message</h2>
            <p className="contact-card-note">All fields marked below are required.</p>
          </div>

          <form className="contact-form" id="contact-form" noValidate onSubmit={formik.handleSubmit}>
            <div className="contact-hp-field" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field blank</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="label" htmlFor="contact-name">
                Full Name
              </label>
              <input
                id="contact-name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                maxLength={100}
                required
                aria-invalid={Boolean(formik.touched.fullName && formik.errors.fullName)}
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="auth-field-error" role="alert">
                  {formik.errors.fullName}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label className="label" htmlFor="contact-email">
                Email Address
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={254}
                required
                aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="auth-field-error" role="alert">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="auth-field">
              <label className="label" htmlFor="contact-subject">
                Subject
              </label>
              <input
                ref={subjectInputRef}
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What is your message about?"
                maxLength={140}
                required
                aria-invalid={Boolean(formik.touched.subject && formik.errors.subject)}
                value={formik.values.subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="auth-field-error" role="alert">
                  {formik.errors.subject}
                </p>
              )}
            </div>

            <div className="auth-field">
              <div className="auth-field-row">
                <label className="label" htmlFor="contact-message">
                  Message
                </label>
                <span className="contact-char-count" aria-live="polite">
                  {formik.values.message.trim().length} / 2500
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Write your question, suggestion, or message here…"
                maxLength={2500}
                required
                aria-invalid={Boolean(formik.touched.message && formik.errors.message)}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.message && formik.errors.message && (
                <p className="auth-field-error" role="alert">
                  {formik.errors.message}
                </p>
              )}
            </div>

            {submitState && (
              <div
                className={cn(
                  'contact-status',
                  submitState.kind === 'success' ? 'is-success' : 'is-error',
                )}
                id="contact-status"
                role={submitState.kind === 'error' ? 'alert' : 'status'}
              >
                {submitState.text}
              </div>
            )}

            <button
              type="submit"
              className="solid-button contact-submit-btn"
              disabled={submitting}
              aria-busy={submitting}
            >
              <span>{submitting ? 'Sending Message…' : 'Send Message'}</span>
              {!submitting && <SvgIcon name="icon-arrow" />}
            </button>
          </form>
        </div>

        <aside className="contact-topics-panel" aria-labelledby="contact-ways-heading">
          <p className="label editorial-kicker">Other Ways to Connect</p>
          <h2 id="contact-ways-heading" className="contact-topics-heading">
            How we can <em>help.</em>
          </h2>
          <p className="contact-topics-intro">
            Select a category below to pre-fill your subject and send it directly through the
            contact form.
          </p>

          <ul className="contact-topics-list">
            {INQUIRY_CHANNELS.map((channel) => {
              const active = formik.values.subject === channel.subjectPreset
              return (
                <li key={channel.id}>
                  <button
                    type="button"
                    className={cn('contact-topic-item', active && 'is-selected')}
                    onClick={() => selectChannelTopic(channel.subjectPreset)}
                  >
                    <span className="contact-topic-title">{channel.title}</span>
                    <span className="contact-topic-desc">{channel.description}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>
      </section>

      <section className="contact-closing-band" aria-label="Closing message">
        <p className="contact-closing-text">“Every thoughtful conversation helps us grow.”</p>
      </section>
    </SubpageLayout>
  )
}

export default ContactView
