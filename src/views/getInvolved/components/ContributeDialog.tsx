import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import type { ContributeSkill } from '@/@types/quran'
import SvgIcon from '@/components/shared/SvgIcon'
import Dialog from '@/components/ui/Dialog'
import { cn } from '@/utils/classNames'

const SKILL_OPTIONS: { value: ContributeSkill; label: string }[] = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'translation', label: 'Translation' },
  { value: 'education', label: 'Education' },
  { value: 'content-review', label: 'Content review' },
]

const contributeSchema = Yup.object({
  skills: Yup.array()
    .of(Yup.string())
    .min(1, 'Choose at least one way you’d like to help before submitting.'),
  email: Yup.string().email('Please enter a valid email address.').required('Please enter your email.'),
})

export interface ContributeDialogProps {
  open: boolean
  onClose: () => void
}

export function ContributeDialog({ open, onClose }: ContributeDialogProps) {
  const [feedback, setFeedback] = useState<string | null>(null)

  const formik = useFormik<{ skills: ContributeSkill[]; email: string }>({
    initialValues: {
      skills: [],
      email: '',
    },
    validationSchema: contributeSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: () => {
      // TODO: Connect this contribution-interest form to the chosen service.
      setFeedback(
        'Thank you for the intention. Contribution sign-up is opening soon — your details weren’t sent or saved yet.',
      )
    },
  })

  const validationFeedback =
    formik.submitCount > 0 ? formik.errors.skills || formik.errors.email : null

  const toggleSkill = (value: ContributeSkill) => {
    const current = formik.values.skills
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    void formik.setFieldValue('skills', next, false)
  }

  const activeFeedback = feedback || (typeof validationFeedback === 'string' ? validationFeedback : null)

  return (
    <Dialog
      id="contribute-dialog"
      className="contribute-dialog"
      open={open}
      onClose={onClose}
      labelledBy="contribute-title"
      closeLabel="Close contribution form"
    >
      <h2 id="contribute-title">
        Bring what
        <br />
        <em>you do best.</em>
      </h2>
      <p>Tell us how you’d like to help shape Quran Bytes.</p>
      <form id="contribute-form" onSubmit={formik.handleSubmit}>
        <fieldset>
          <legend className="label">I can help with</legend>
          <div className="role-options">
            {SKILL_OPTIONS.map((option) => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  name="skills"
                  value={option.value}
                  checked={formik.values.skills.includes(option.value)}
                  onChange={() => toggleSkill(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="label dialog-email-label" htmlFor="contribute-email">
          Your email
        </label>
        <input
          id="contribute-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          maxLength={254}
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <button className="solid-button" type="submit">
          <span>Share your interest</span>
          <SvgIcon name="icon-arrow" />
        </button>
        <p
          className={cn('form-note', activeFeedback && 'is-feedback')}
          id="contribute-feedback"
          role="status"
        >
          {activeFeedback || 'Choose how you’d like to help shape the platform.'}
        </p>
      </form>
    </Dialog>
  )
}

export default ContributeDialog
