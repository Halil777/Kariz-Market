import { createSlice } from '@reduxjs/toolkit';

export type Locale = 'en' | 'ru' | 'tk';

const initial: Locale = (localStorage.getItem('locale') as Locale) || 'en';

const slice = createSlice({
  name: 'locale',
  initialState: { locale: initial },
  reducers: {
    setLocale(state, action: { payload: Locale }) {
      state.locale = action.payload;
      localStorage.setItem('locale', state.locale);
    },
  },
});

export const { setLocale } = slice.actions;
export default slice.reducer;

