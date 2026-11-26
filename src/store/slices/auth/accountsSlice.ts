import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface StoredAccount {
  id: string
  name: string
  email: string
  salt: string
  passwordHash: string
  createdAt: string
}

export interface AccountsState {
  byEmail: Record<string, StoredAccount>
}

const initialState: AccountsState = {
  byEmail: {},
}

const accountsSlice = createSlice({
  name: 'auth/accounts',
  initialState,
  reducers: {
    registerLocalAccount(state, action: PayloadAction<StoredAccount>) {
      const normalized = action.payload.email.trim().toLowerCase()
      state.byEmail[normalized] = { ...action.payload, email: normalized }
    },
    updateLocalPassword(
      state,
      action: PayloadAction<{ email: string; salt: string; passwordHash: string }>,
    ) {
      const normalized = action.payload.email.trim().toLowerCase()
      const existing = state.byEmail[normalized]
      if (existing) {
        existing.salt = action.payload.salt
        existing.passwordHash = action.payload.passwordHash
      }
    },
  },
})

export const { registerLocalAccount, updateLocalPassword } = accountsSlice.actions
export default accountsSlice.reducer
