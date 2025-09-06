import { createSlice } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

const initialMode = ((): ThemeMode => {
  const saved = localStorage.getItem('themeMode');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
})();

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initialMode as ThemeMode },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.mode);
    },
    setTheme(state, action: { payload: ThemeMode }) {
      state.mode = action.payload;
      localStorage.setItem('themeMode', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

