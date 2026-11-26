import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SvgIcon from '@/components/shared/SvgIcon'
import useAuth from '@/utils/hooks/useAuth'
import AuthShell from '../components/AuthShell'

const emailStepSchema = Yup.object({
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
})

const resetStepSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters.')
    .required('New password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match.')
    .required('Please confirm your new password.'),
})

export function ForgotPasswordView() {
  const { hasRegisteredEmail, hasBackend, resetAccountPassword } = useAuth()
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const emailFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: emailStepSchema,
    onSubmit: ({ email }) => {
      setErrorMessage(null)
      if (!hasBackend && !hasRegisteredEmail(email)) {
        setErrorMessage('No account is registered under this email yet. Create an account first.')
        return
      }
      setVerifiedEmail(email.trim().toLowerCase())
      setStep('reset')
    },
  })

  const resetFormik = useFormik({
    initialValues: { newPassword: '', confirmPassword: '' },
    validationSchema: resetStepSchema,
    onSubmit: async ({ newPassword }, { setSubmitting }) => {
      setErrorMessage(null)
      const res = await resetAccountPassword({ email: verifiedEmail, newPassword })
      setSubmitting(false)
      if (!res.ok) {
        setErrorMessage(res.error || 'Could not reset password.')
        return
      }
      setStep('done')
    },
  })

  return (
    <AuthShell
      kicker="Password Recovery"
      title={
        <>
          Reset your <em>password.</em>
        </>
      }
      subtitle="Verify your account email and choose a new password to regain access."
    >
      {step === 'email' && (
        <form className="auth-form" onSubmit={emailFormik.handleSubmit} noValidate>
          <div className="auth-field">
            <label className="label" htmlFor="recovery-email">
              Registered email address
            </label>
            <input
              id="recovery-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={emailFormik.values.email}
              onChange={emailFormik.handleChange}
              onBlur={emailFormik.handleBlur}
            />
            {emailFormik.touched.email && emailFormik.errors.email && (
              <p className="auth-field-error">{emailFormik.errors.email}</p>
            )}
          </div>

          {errorMessage && (
            <p className="auth-alert" role="alert">
              {errorMessage}
            </p>
          )}

          <button className="solid-button" type="submit">
            <span>Continue</span>
            <SvgIcon name="icon-arrow" />
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form className="auth-form" onSubmit={resetFormik.handleSubmit} noValidate>
          <p className="tool-status-banner">Resetting password for {verifiedEmail}</p>
          <div className="auth-field">
            <label className="label" htmlFor="reset-password">
              New password
            </label>
            <input
              id="reset-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={resetFormik.values.newPassword}
              onChange={resetFormik.handleChange}
              onBlur={resetFormik.handleBlur}
            />
            {resetFormik.touched.newPassword && resetFormik.errors.newPassword && (
              <p className="auth-field-error">{resetFormik.errors.newPassword}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="label" htmlFor="reset-confirm">
              Confirm new password
            </label>
            <input
              id="reset-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your new password"
              value={resetFormik.values.confirmPassword}
              onChange={resetFormik.handleChange}
              onBlur={resetFormik.handleBlur}
            />
            {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
              <p className="auth-field-error">{resetFormik.errors.confirmPassword}</p>
            )}
          </div>

          {errorMessage && (
            <p className="auth-alert" role="alert">
              {errorMessage}
            </p>
          )}

          <button className="solid-button" type="submit" disabled={resetFormik.isSubmitting}>
            <span>{resetFormik.isSubmitting ? 'Updating Password…' : 'Update Password'}</span>
            <SvgIcon name="icon-arrow" />
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="auth-success-box">
          <p>
            Your password for <strong>{verifiedEmail}</strong> has been updated cleanly.
          </p>
          <Link to="/login" className="solid-button">
            <span>Return to Login</span>
            <SvgIcon name="icon-arrow" />
          </Link>
        </div>
      )}

      <p className="auth-footer-link">
        Remembered your password? <Link to="/login">Back to Login</Link>
      </p>
    </AuthShell>
  )
}

export default ForgotPasswordView
