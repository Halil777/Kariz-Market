import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Notification = {
  id: string
  title: string
  message?: string
  createdAt: string
  type?: 'info' | 'success' | 'warning' | 'error'
}

type NotificationsState = {
  list: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  list: [],
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.list.unshift(action.payload)
      state.unreadCount += 1
    },
    markAllRead(state) {
      state.unreadCount = 0
    },
    clear(state) {
      state.list = []
      state.unreadCount = 0
    },
  },
})

export const { addNotification, markAllRead, clear } = notificationsSlice.actions
export default notificationsSlice.reducer
