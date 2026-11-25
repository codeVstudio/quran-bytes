import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface CommonState {
  currentRouteKey: string
  introComplete: boolean
  contributeDialogOpen: boolean
  helpOpen: boolean
}

const initialState: CommonState = {
  currentRouteKey: 'home',
  introComplete:
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  contributeDialogOpen: false,
  helpOpen: false,
}

const commonSlice = createSlice({
  name: 'base/common',
  initialState,
  reducers: {
    setCurrentRouteKey(state, action: PayloadAction<string>) {
      state.currentRouteKey = action.payload
    },
    setIntroComplete(state, action: PayloadAction<boolean>) {
      state.introComplete = action.payload
    },
    setContributeDialogOpen(state, action: PayloadAction<boolean>) {
      state.contributeDialogOpen = action.payload
    },
    setHelpOpen(state, action: PayloadAction<boolean>) {
      state.helpOpen = action.payload
    },
  },
})

export const {
  setCurrentRouteKey,
  setIntroComplete,
  setContributeDialogOpen,
  setHelpOpen,
} = commonSlice.actions
export default commonSlice.reducer
