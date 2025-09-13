import React from 'react'
import { Avatar, Box, Button, Container, TextField, Typography } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
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
