import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
export const ForgotPasswordPage: React.FC = () => (
  <Box sx={{ maxWidth: 420, mx: 'auto' }}>
    <Typography variant="h5" sx={{ mb: 2 }}>Forgot Password</Typography>
    <TextField fullWidth label="Email" sx={{ mb: 2 }} />
    <Button fullWidth variant="contained">Send reset link</Button>
  </Box>
);

