import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Direction, LayoutType, Mode, NavMode, ThemeState } from '@/@types/theme'
import { themeConfig } from '@/configs/theme.config'

const initialState: ThemeState = { ...themeConfig }

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDirection(state, action: PayloadAction<Direction>) {
      state.direction = action.payload
    },
    setMode(state, action: PayloadAction<Mode>) {
      state.mode = action.payload
    },
    setLayout(state, action: PayloadAction<LayoutType>) {
      state.layout.previousType = state.layout.type
      state.layout.type = action.payload
    },
    setSideNavCollapse(state, action: PayloadAction<boolean>) {
      state.layout.sideNavCollapse = action.payload
    },
    setNavMode(state, action: PayloadAction<NavMode>) {
      state.navMode = action.payload
    },
    setPanelExpand(state, action: PayloadAction<boolean>) {
      state.panelExpand = action.payload
    },
  },
})

export const {
  setDirection,
  setMode,
  setLayout,
  setSideNavCollapse,
  setNavMode,
  setPanelExpand,
} = themeSlice.actions

export default themeSlice.reducer
