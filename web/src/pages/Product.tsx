import React from 'react';
import { Box, Grid, Typography, Button, Card, CardContent } from '@mui/material';

export const ProductPage: React.FC = () => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}><Card variant="outlined" sx={{ height: 360 }}><CardContent>Image Gallery</CardContent></Card></Grid>
    <Grid item xs={12} md={6}>
      <Typography variant="h5">Product Name</Typography>
      <Typography variant="h6" color="primary" sx={{ my: 1 }}>$99.00</Typography>
      <Button variant="contained" sx={{ mr: 1 }}>Add to Cart</Button>
      <Button variant="outlined">Wishlist</Button>
      <Box sx={{ mt: 2 }}>
        <Typography>Vendor info, stock, discount...</Typography>
      </Box>
    </Grid>
    <Grid item xs={12}><Card variant="outlined"><CardContent>Tabs: Description | Specifications | Reviews | Q&A</CardContent></Card></Grid>
  </Grid>
);

