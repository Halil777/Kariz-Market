import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type LocaleState = { lang: 'en' | 'ru' | 'tk' };
const initialState: LocaleState = { lang: 'en' };

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLang(state, action: PayloadAction<'en' | 'ru' | 'tk'>) { state.lang = action.payload; },
  }
});

export const { setLang } = localeSlice.actions;
export default localeSlice.reducer;
