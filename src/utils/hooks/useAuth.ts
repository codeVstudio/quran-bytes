import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { signInSuccess, signOutSuccess } from '@/store/slices/auth/sessionSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { signedIn, token, user } = useAppSelector((state) => state.auth)

  const signIn = useCallback(
    (payload: { token: string; name?: string; email?: string; authority?: string[] }) => {
      dispatch(signInSuccess(payload))
    },
    [dispatch],
  )

  const signOut = useCallback(() => {
    dispatch(signOutSuccess())
  }, [dispatch])

  return {
    authenticated: Boolean(token && signedIn),
    user,
    authority: user.authority,
    signIn,
    signOut,
  }
}

export default useAuth
