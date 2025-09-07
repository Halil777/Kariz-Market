import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
export const RegisterPage: React.FC = () => (
  <Box sx={{ maxWidth: 420, mx: 'auto' }}>
    <Typography variant="h5" sx={{ mb: 2 }}>Register</Typography>
    <TextField fullWidth label="Name" sx={{ mb: 2 }} />
    <TextField fullWidth label="Email" sx={{ mb: 2 }} />
    <TextField fullWidth label="Phone" sx={{ mb: 2 }} />
    <TextField fullWidth type="password" label="Password" sx={{ mb: 2 }} />
    <Button fullWidth variant="contained">Create account</Button>
  </Box>
);

