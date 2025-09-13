import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './uiSlice'
import vendorReducer from './vendorSlice'
import notificationsReducer from './notificationsSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    vendor: vendorReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
