import { createSlice } from '@reduxjs/toolkit';

type UIState = { darkMode: boolean };
const initialState: UIState = { darkMode: false };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) { state.darkMode = !state.darkMode; },
  }
});

export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;

