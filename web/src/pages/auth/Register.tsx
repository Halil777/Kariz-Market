import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { register } from '../../api/auth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const from = (location.state as { from?: string } | null)?.from ?? '/account';
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { accessToken, refreshToken } = await register({
        email: email.trim(),
        password,
        displayName: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      localStorage.setItem('customer.accessToken', accessToken);
      localStorage.setItem('customer.refreshToken', refreshToken);
      queryClient.invalidateQueries({ queryKey: ['account-overview'] });
      navigate(from);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        setError('Please make sure your details are valid and try again.');
      } else if (isAxiosError(err) && err.response?.status === 409) {
        setError('An account with this email already exists.');
      } else {
        setError('Unable to create your account right now. Please try again later.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', py: 6 }}>
      <Card variant="outlined">
        <CardHeader title="Create an account" subheader="Track your orders and earn loyalty rewards" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Optional"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 6 characters"
                required
                fullWidth
              />
              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </Button>
              <Button component={Link} to="/login" size="small">
                Already have an account? Sign in
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
