import React from 'react'
import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../api/client'

type LoginResponse = { accessToken: string; refreshToken: string }
type CurrentUser = { id: string; email: string; role: string; vendorId?: string | null }

const clearVendorSession = () => {
  try {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('vendor.me')
  } catch {}
}

const readErrorResponse = async (res: Response): Promise<string> => {
  const fallback = res.statusText || `Request failed with status ${res.status}`
  const text = await res.text()
  if (!text) return fallback
  try {
    const data = JSON.parse(text)
    const message = (data?.message ?? data?.error) || fallback
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
    return typeof data === 'string' ? data : fallback
  } catch {
    return text
  }
}

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Email and password are required')
      return
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      })
      if (!res.ok) throw new Error(await readErrorResponse(res))

      const tokens: LoginResponse = await res.json()
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)

      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      if (!meRes.ok) throw new Error(await readErrorResponse(meRes))

      const profile: CurrentUser = await meRes.json()
      if (profile.role !== 'vendor_user' || !profile.vendorId) {
        throw new Error('This account is not assigned to a vendor.')
      }

      localStorage.setItem('vendor.me', JSON.stringify(profile))
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      clearVendorSession()
      setError(err?.message || 'Login failed')
    }
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 12 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Vendor Login</Typography>
        <Box component="form" onSubmit={submit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
        </Box>
      </Box>
    </Container>
  )
}
