import React from 'react';
import { Box, Container, Link as MLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => (
  <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 2, py: 3 }}>
    <Container sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="body2">© {new Date().getFullYear()} Käriz Market</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <MLink component={Link} to="/about">About</MLink>
        <MLink component={Link} to="/contact">Contact</MLink>
        <MLink component={Link} to="/privacy">Privacy</MLink>
        <MLink component={Link} to="/terms">Terms</MLink>
      </Box>
    </Container>
  </Box>
);

