import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type PaletteMode = 'light' | 'dark'

type UIState = {
  sidebarOpen: boolean
  mode: PaletteMode
  language: string
}

const storedLanguage = localStorage.getItem('lang')
const normalizedLanguage = storedLanguage === 'fa' ? 'tk' : (storedLanguage || 'en')

if (storedLanguage === 'fa') {
  localStorage.setItem('lang', 'tk')
}

const initialState: UIState = {
  sidebarOpen: true,
  mode: (localStorage.getItem('mode') as PaletteMode) || 'light',
  language: normalizedLanguage,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setMode(state, action: PayloadAction<PaletteMode>) {
      state.mode = action.payload
      localStorage.setItem('mode', state.mode)
    },
    toggleMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('mode', state.mode)
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload
      localStorage.setItem('lang', state.language)
    },
  },
})

export const { toggleSidebar, setMode, toggleMode, setLanguage } = uiSlice.actions
export default uiSlice.reducer
