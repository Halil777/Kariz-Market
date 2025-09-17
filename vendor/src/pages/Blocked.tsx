import { useEffect, useState } from 'react'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMyVendor } from '../api/vendors'

export default function Blocked() {
  const location = useLocation() as any
  const navigate = useNavigate()
  const reason: string | undefined = location.state?.reason
  const [checking, setChecking] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    (async () => {
      setChecking(true)
      const v = await getMyVendor()
      setChecking(false)
      if (v && (v as any).status === 'active') {
        navigate('/dashboard', { replace: true })
      }
    })()
  }, [tick, navigate])

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Access Restricted
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {reason || 'Your vendor account is not active or has been removed. Please contact support or the marketplace administrator.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/login', { replace: true })}>Back to Login</Button>
          <Button variant="contained" disabled={checking} onClick={() => setTick((t) => t + 1)}>
            {checking ? 'Checking…' : 'Retry Access'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
