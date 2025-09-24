import React, { useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Stack, TextField, Typography, Alert } from '@mui/material'
import { login, me } from '@/api/auth'
import { useNavigate } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async () => {
    setError('')
    try {
      const res = await login(email, password)
      localStorage.setItem('admin.accessToken', res.accessToken)
      localStorage.setItem('admin.refreshToken', res.refreshToken)
      try {
        const user = await me()
        localStorage.setItem('admin.me', JSON.stringify(user))
      } catch {}
      navigate('/', { replace: true })
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Login failed')
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

