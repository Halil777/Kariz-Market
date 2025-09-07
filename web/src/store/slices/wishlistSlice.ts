import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type WishlistState = { ids: string[] };
const initialState: WishlistState = { ids: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<string>) {
      const i = state.ids.indexOf(action.payload);
      if (i >= 0) state.ids.splice(i, 1); else state.ids.push(action.payload);
    },
    clear(state) { state.ids = []; }
  }
});

export const { toggle, clear } = wishlistSlice.actions;
export default wishlistSlice.reducer;
