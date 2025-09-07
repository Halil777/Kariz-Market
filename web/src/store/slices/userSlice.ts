import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type User = { id: string; name: string; email: string; loyaltyPoints?: number } | null;
type UserState = { current: User };
const initialState: UserState = { current: null };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) { state.current = action.payload; },
    logout(state) { state.current = null; },
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
