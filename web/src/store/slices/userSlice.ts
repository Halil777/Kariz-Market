import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type UserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  loyaltyPoints: number;
  createdAt: string;
} | null;

type UserState = { current: UserProfile };

const initialState: UserState = { current: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.current = action.payload;
    },
    logout(state) {
      state.current = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
