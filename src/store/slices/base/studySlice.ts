import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface StudyState {
  bookmarkedAyahs: string[]
  bookmarkedEntries: string[]
  lastReadSurah: number
  preferredEdition: string
}

const initialState: StudyState = {
  bookmarkedAyahs: [],
  bookmarkedEntries: [],
  lastReadSurah: 1,
  preferredEdition: 'en.sahih',
}

const studySlice = createSlice({
  name: 'base/study',
  initialState,
  reducers: {
    toggleAyahBookmark(state, action: PayloadAction<string>) {
      const key = action.payload
      if (state.bookmarkedAyahs.includes(key)) {
        state.bookmarkedAyahs = state.bookmarkedAyahs.filter((item) => item !== key)
      } else {
        state.bookmarkedAyahs.push(key)
      }
    },
    toggleEntryBookmark(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.bookmarkedEntries.includes(id)) {
        state.bookmarkedEntries = state.bookmarkedEntries.filter((item) => item !== id)
      } else {
        state.bookmarkedEntries.push(id)
      }
    },
    setLastReadSurah(state, action: PayloadAction<number>) {
      state.lastReadSurah = action.payload
    },
    setPreferredEdition(state, action: PayloadAction<string>) {
      state.preferredEdition = action.payload
    },
  },
})

export const {
  toggleAyahBookmark,
  toggleEntryBookmark,
  setLastReadSurah,
  setPreferredEdition,
} = studySlice.actions

export default studySlice.reducer
