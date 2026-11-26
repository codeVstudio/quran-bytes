import { useCallback } from 'react'
import axios from 'axios'
import appConfig from '@/configs/app.config'
import endpointConfig from '@/configs/endpoint.config'
import { READER } from '@/constants/roles.constant'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { registerLocalAccount, updateLocalPassword } from '@/store/slices/auth/accountsSlice'
import { signInSuccess, signOutSuccess } from '@/store/slices/auth/sessionSlice'
import { createSalt, hashSecret } from '@/utils/crypto'

export interface AuthResult {
  ok: boolean
  error?: string
}

export function useAuth() {
  const dispatch = useAppDispatch()
  const { signedIn, token, user } = useAppSelector((state) => state.auth)
  const accountsByEmail = useAppSelector((state) => state.accounts.byEmail)

  const signIn = useCallback(
    (payload: { token: string; name?: string; email?: string; authority?: string[] }) => {
      dispatch(signInSuccess(payload))
    },
    [dispatch],
  )

  const loginWithEmail = useCallback(
    async ({ email, password }: { email: string; password: string }): Promise<AuthResult> => {
      const normalized = email.trim().toLowerCase()

      if (appConfig.authApiBaseUrl) {
        try {
          const { data } = await axios.post<{ token: string; user: { name: string; email: string; authority?: string[] } }>(
            `${appConfig.authApiBaseUrl}${endpointConfig.authLogin}`,
            { email: normalized, password },
          )
          dispatch(
            signInSuccess({
              token: data.token,
              name: data.user.name,
              email: data.user.email,
              authority: data.user.authority ?? [READER],
            }),
          )
          return { ok: true }
        } catch (err) {
          const msg = axios.isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message ||
              'Invalid email or password.'
            : 'Unable to sign in right now.'
          return { ok: false, error: msg }
        }
      }

      const account = accountsByEmail[normalized]
      if (!account) {
        return {
          ok: false,
          error: 'No account found with this email. Create a free account first.',
        }
      }

      const candidateHash = await hashSecret(password, account.salt)
      if (candidateHash !== account.passwordHash) {
        return { ok: false, error: 'Incorrect password. Please try again or reset it.' }
      }

      dispatch(
        signInSuccess({
          token: `qb-local-${account.id}`,
          name: account.name,
          email: account.email,
          authority: [READER],
        }),
      )
      return { ok: true }
    },
    [accountsByEmail, dispatch],
  )

  const registerAccount = useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }): Promise<AuthResult> => {
      const normalized = email.trim().toLowerCase()
      const cleanName = name.trim()

      if (appConfig.authApiBaseUrl) {
        try {
          const { data } = await axios.post<{ token: string; user: { name: string; email: string } }>(
            `${appConfig.authApiBaseUrl}${endpointConfig.authRegister}`,
            { name: cleanName, email: normalized, password },
          )
          dispatch(
            signInSuccess({
              token: data.token,
              name: data.user.name,
              email: data.user.email,
              authority: [READER],
            }),
          )
          return { ok: true }
        } catch (err) {
          const msg = axios.isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message ||
              'Registration failed.'
            : 'Unable to create account right now.'
          return { ok: false, error: msg }
        }
      }

      if (accountsByEmail[normalized]) {
        return { ok: false, error: 'An account with this email already exists. Please login instead.' }
      }

      const salt = createSalt()
      const passwordHash = await hashSecret(password, salt)
      const id = createSalt()

      dispatch(
        registerLocalAccount({
          id,
          name: cleanName,
          email: normalized,
          salt,
          passwordHash,
          createdAt: new Date().toISOString(),
        }),
      )
      dispatch(
        signInSuccess({
          token: `qb-local-${id}`,
          name: cleanName,
          email: normalized,
          authority: [READER],
        }),
      )
      return { ok: true }
    },
    [accountsByEmail, dispatch],
  )

  const hasRegisteredEmail = useCallback(
    (email: string): boolean => Boolean(accountsByEmail[email.trim().toLowerCase()]),
    [accountsByEmail],
  )

  const resetAccountPassword = useCallback(
    async ({ email, newPassword }: { email: string; newPassword: string }): Promise<AuthResult> => {
      const normalized = email.trim().toLowerCase()

      if (appConfig.authApiBaseUrl) {
        try {
          await axios.post(`${appConfig.authApiBaseUrl}${endpointConfig.authResetPassword}`, {
            email: normalized,
            password: newPassword,
          })
          return { ok: true }
        } catch {
          return { ok: false, error: 'Unable to update password right now.' }
        }
      }

      if (!accountsByEmail[normalized]) {
        return { ok: false, error: 'No account found with this email.' }
      }

      const salt = createSalt()
      const passwordHash = await hashSecret(newPassword, salt)
      dispatch(updateLocalPassword({ email: normalized, salt, passwordHash }))
      return { ok: true }
    },
    [accountsByEmail, dispatch],
  )

  const signOut = useCallback(() => {
    dispatch(signOutSuccess())
  }, [dispatch])

  return {
    authenticated: Boolean(token && signedIn),
    user,
    authority: user.authority,
    hasBackend: Boolean(appConfig.authApiBaseUrl),
    signIn,
    loginWithEmail,
    registerAccount,
    hasRegisteredEmail,
    resetAccountPassword,
    signOut,
  }
}

export default useAuth
