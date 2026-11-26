import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SvgIcon from '@/components/shared/SvgIcon'
import useAuth from '@/utils/hooks/useAuth'
import AuthShell from '../components/AuthShell'

const signUpSchema = Yup.object({
  name: Yup.string().min(2, 'Enter at least 2 characters.').required('Full name is required.'),
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Confirm your password.'),
})

export function SignUpView() {
  const navigate = useNavigate()
  const { registerAccount } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null)
      const result = await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      setSubmitting(false)
      if (!result.ok) {
        setServerError(result.error || 'Could not register account.')
        return
      }
      navigate('/get-started', { replace: true })
    },
  })

  return (
    <AuthShell
      kicker="Begin Your Account"
      title={
        <>
          Create an <em>account.</em>
        </>
      }
      subtitle="Join Quran Bytes to save your favourite ayahs, translations, and authentic collections."
    >
      <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
        <div className="auth-field">
          <label className="label" htmlFor="signup-name">
            Full name
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="auth-field-error">{formik.errors.name}</p>
          )}
        </div>

        <div className="auth-field">
          <label className="label" htmlFor="signup-email">
            Email address
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="auth-field-error">{formik.errors.email}</p>
          )}
        </div>

        <div className="auth-field">
          <label className="label" htmlFor="signup-password">
            Password
          </label>
          <div className="auth-password-wrap">
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="auth-field-error">{formik.errors.password}</p>
          )}
        </div>

        <div className="auth-field">
          <label className="label" htmlFor="signup-confirm">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="auth-field-error">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {serverError && (
          <p className="auth-alert" role="alert">
            {serverError}
          </p>
        )}

        <button className="solid-button" type="submit" disabled={formik.isSubmitting}>
          <span>{formik.isSubmitting ? 'Creating Account…' : 'Sign Up'}</span>
          <SvgIcon name="icon-arrow" />
        </button>
      </form>

      <p className="auth-footer-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthShell>
  )
}

export default SignUpView
