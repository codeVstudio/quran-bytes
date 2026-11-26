import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SvgIcon from '@/components/shared/SvgIcon'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import useAuth from '@/utils/hooks/useAuth'
import AuthShell from '../components/AuthShell'

const loginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email address.').required('Email is required.'),
  password: Yup.string().required('Password is required.'),
})

export function LoginView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithEmail, authenticated, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null)
      const result = await loginWithEmail(values)
      setSubmitting(false)
      if (!result.ok) {
        setServerError(result.error || 'Could not sign in.')
        return
      }
      const next = searchParams.get(REDIRECT_URL_KEY)
      navigate(next && next.startsWith('/') ? next : '/get-started', { replace: true })
    },
  })

  if (authenticated) {
    return (
      <AuthShell
        kicker="Account Active"
        title={
          <>
            Welcome back, <em>{user.name}</em>
          </>
        }
        subtitle={`Signed in as ${user.email}. Your bookmarked ayahs and study preferences stay synced here.`}
      >
        <div className="auth-logged-in-actions">
          <Link to="/get-started" className="solid-button">
            <span>Continue to Explore Paths</span>
            <SvgIcon name="icon-arrow" />
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      kicker="Account Access"
      title={
        <>
          Welcome <em>back.</em>
        </>
      }
      subtitle="Sign in to keep your bookmarks, reading progress, and learning preferences."
    >
      <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
        <div className="auth-field">
          <label className="label" htmlFor="login-email">
            Email address
          </label>
          <input
            id="login-email"
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
          <div className="auth-field-row">
            <label className="label" htmlFor="login-password">
              Password
            </label>
            <Link to="/forgot-password" className="auth-inline-link">
              Forgot Password?
            </Link>
          </div>
          <div className="auth-password-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
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

        {serverError && (
          <p className="auth-alert" role="alert">
            {serverError}
          </p>
        )}

        <button className="solid-button" type="submit" disabled={formik.isSubmitting}>
          <span>{formik.isSubmitting ? 'Signing in…' : 'Login'}</span>
          <SvgIcon name="icon-arrow" />
        </button>
      </form>

      <p className="auth-footer-link">
        New to Quran Bytes? <Link to="/signup">Create an account</Link>
      </p>
    </AuthShell>
  )
}

export default LoginView
