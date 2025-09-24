import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin.accessToken') : null
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

