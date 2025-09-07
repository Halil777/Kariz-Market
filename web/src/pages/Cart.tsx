import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export const CartPage: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2 }}>Shopping Cart</Typography>
    <Typography sx={{ mb: 2 }}>Items list, quantity selector, totals...</Typography>
    <Button variant="contained" component={Link} to="/checkout">Checkout</Button>
  </Box>
);

