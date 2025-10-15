import React, { useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Stack, TextField, Typography, Alert } from '@mui/material'
import { login, me } from '@/api/auth'
import { useNavigate } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const clearStoredSession = () => {
    try {
      localStorage.removeItem('admin.accessToken')
      localStorage.removeItem('admin.refreshToken')
      localStorage.removeItem('admin.me')
    } catch {}
  }

  const parseError = (err: any) => {
    const message = err?.response?.data?.message || err?.message || err?.toString?.() || 'Login failed'
    return Array.isArray(message) ? message.join(', ') : String(message)
  }

  const submit = async () => {
    const trimmedEmail = email.trim()
    setError('')
    if (!trimmedEmail || !password) {
      setError('Email and password are required')
      return
    }

    try {
      const res = await login(trimmedEmail, password)
      localStorage.setItem('admin.accessToken', res.accessToken)
      localStorage.setItem('admin.refreshToken', res.refreshToken)

      const profile = await me()
      if (!['admin', 'super_admin'].includes(profile.role)) {
        throw new Error('You do not have permission to access the admin panel.')
      }
      localStorage.setItem('admin.me', JSON.stringify(profile))
      navigate('/', { replace: true })
    } catch (err: any) {
      clearStoredSession()
      setError(parseError(err))
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '80vh', p: 2 }}>
      <Card sx={{ width: 380, maxWidth: '100%' }}>
        <CardHeader title="Admin Login" />
        <CardContent>
          <Stack spacing={2}>
            {error && <Alert severity="error">{String(error)}</Alert>}
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            <Button variant="contained" onClick={submit}>Sign In</Button>
            <Typography variant="caption" color="text.secondary">You need an Admin or SuperAdmin account.</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

