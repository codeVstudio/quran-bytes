import { useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SvgIcon from '@/components/shared/SvgIcon'
import Footer from '@/components/template/Footer'
import { cn } from '@/utils/classNames'
import ContributeDialog from './ContributeDialog'

const CLOSING_STAR_CLASSES = [
  'closing-star-one',
  'closing-star-two',
  'closing-star-three',
  'closing-star-four',
  'closing-star-five',
  'closing-star-six',
  'closing-star-seven',
  'closing-star-eight',
  'closing-star-nine',
  'closing-star-ten',
  'closing-star-eleven',
  'closing-star-twelve',
  'closing-star-thirteen',
  'closing-star-fourteen',
  'closing-star-fifteen',
  'closing-star-sixteen',
]

const updatesSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address.').required('Please enter an email address.'),
})

export function GetInvolvedSection() {
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [updatesFeedback, setUpdatesFeedback] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: updatesSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      // TODO: Connect to Formspree or a similar opt-in email service.
      setUpdatesFeedback(
        'Thank you — launch sign-up is opening soon, and nothing was sent or saved yet.',
      )
    },
  })

  const validationError = formik.submitCount > 0 ? formik.errors.email : null
  const activeFeedback = updatesFeedback || validationError

  const handleCloseDialog = () => {
    setDialogOpen(false)
    requestAnimationFrame(() => openButtonRef.current?.focus({ preventScroll: true }))
  }

  return (
    <>
      <section className="closing" id="get-involved" aria-labelledby="closing-title">
        <div className="closing-sky" aria-hidden="true">
          {CLOSING_STAR_CLASSES.map((cls) => (
            <svg key={cls} className={`sky-star ${cls}`} viewBox="0 0 16 16" focusable="false">
              <use href="#sky-star" />
            </svg>
          ))}
        </div>
        <div className="closing-title-row">
          <h2 id="closing-title" className="reveal-heading">
            <span className="text-line">
              <span>Help shape</span>
            </span>
            <span className="text-line">
              <span>
                <em>Quran Bytes.</em>
              </span>
            </span>
          </h2>
        </div>
        <div className="closing-actions">
          <div className="signup-block">
            <h3>Get launch updates.</h3>
            <p>Be here when the first chapter opens.</p>
            <form id="updates-form" className="email-form" onSubmit={formik.handleSubmit}>
              <label className="sr-only" htmlFor="updates-email">
                Email address for launch updates
              </label>
              <input
                id="updates-email"
                name="email"
                type="email"
                placeholder="Your email address"
                autoComplete="email"
                required
                maxLength={254}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <button className="magnetic" type="submit" aria-label="Request launch updates">
                <SvgIcon name="icon-arrow" />
              </button>
            </form>
            <p
              className={cn('form-note', activeFeedback && 'is-feedback')}
              id="updates-feedback"
              role="status"
            >
              {activeFeedback || 'One thoughtful note when the first chapter opens. No spam, ever.'}
            </p>
          </div>
          <div className="contribute-block">
            <h3>Contribute your skills.</h3>
            <p>
              Good with code, words, design, or teaching?
              <br />
              There’s a place for your perspective.
            </p>
            <button
              ref={openButtonRef}
              className="text-action magnetic"
              id="open-contribute"
              type="button"
              onClick={() => setDialogOpen(true)}
            >
              <span>Let’s build something meaningful</span>
              <SvgIcon name="icon-arrow-up" />
            </button>
            <p className="form-note">Developers · Designers · Translators · Educators · Reviewers</p>
          </div>
        </div>
        <Footer />
      </section>
      <ContributeDialog open={dialogOpen} onClose={handleCloseDialog} />
    </>
  )
}

export default GetInvolvedSection
