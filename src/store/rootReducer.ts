import { combineReducers, type AnyAction, type Reducer } from '@reduxjs/toolkit'
import RtkQueryService from '@/services/RtkQueryService'
import accounts, { type AccountsState } from './slices/auth/accountsSlice'
import auth, { type SessionState } from './slices/auth/sessionSlice'
import base, { type CommonState } from './slices/base/commonSlice'
import study, { type StudyState } from './slices/base/studySlice'
import theme from './slices/theme/themeSlice'
import type { ThemeState } from '@/@types/theme'

export type RootState = {
  auth: SessionState
  accounts: AccountsState
  base: CommonState
  study: StudyState
  theme: ThemeState
  [RtkQueryService.reducerPath]: ReturnType<typeof RtkQueryService.reducer>
}

export interface AsyncReducers {
  [key: string]: Reducer<unknown, AnyAction>
}

const staticReducers = {
  auth,
  accounts,
  base,
  study,
  theme,
  [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}

const rootReducer =
  (asyncReducers?: AsyncReducers) => (state: RootState | undefined, action: AnyAction) => {
    const combinedReducer = combineReducers({
      ...staticReducers,
      ...asyncReducers,
    })
    return combinedReducer(state, action)
  }

export default rootReducer
