import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { READER } from '@/constants/roles.constant'

export interface SessionState {
  token: string | null
  signedIn: boolean
  user: {
    name: string
    email: string
    authority: string[]
  }
}

const initialState: SessionState = {
  token: null,
  signedIn: false,
  user: {
    name: 'Guest Reader',
    email: '',
    authority: [READER],
  },
}

const sessionSlice = createSlice({
  name: 'auth/session',
  initialState,
  reducers: {
    signInSuccess(
      state,
      action: PayloadAction<{ token: string; name?: string; email?: string; authority?: string[] }>,
    ) {
      state.signedIn = true
      state.token = action.payload.token
      if (action.payload.name) state.user.name = action.payload.name
      if (action.payload.email) state.user.email = action.payload.email
      if (action.payload.authority) state.user.authority = action.payload.authority
    },
    signOutSuccess(state) {
      state.signedIn = false
      state.token = null
      state.user = {
        name: 'Guest Reader',
        email: '',
        authority: [READER],
      }
    },
  },
})

export const { signInSuccess, signOutSuccess } = sessionSlice.actions
export default sessionSlice.reducer
