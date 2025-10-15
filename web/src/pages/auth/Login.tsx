import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { login } from '../../api/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = (location.state as { from?: string } | null)?.from ?? '/account';
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { accessToken, refreshToken } = await login({ email: email.trim(), password });
      localStorage.setItem('customer.accessToken', accessToken);
      localStorage.setItem('customer.refreshToken', refreshToken);
      queryClient.invalidateQueries({ queryKey: ['account-overview'] });
      navigate(from);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Unable to sign in right now. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', py: 6 }}>
      <Card variant="outlined">
        <CardHeader title="Sign in" subheader="Access your account and view recent activity" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Button component={Link} to="/register" size="small">
                  Need an account?
                </Button>
                <Button component={Link} to="/forgot-password" size="small">
                  Forgot password?
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
