import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
export const LoginPage: React.FC = () => (
  <Box sx={{ maxWidth: 420, mx: 'auto' }}>
    <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
    <TextField fullWidth label="Email" sx={{ mb: 2 }} />
    <TextField fullWidth type="password" label="Password" sx={{ mb: 2 }} />
    <Button fullWidth variant="contained">Login</Button>
  </Box>
);

