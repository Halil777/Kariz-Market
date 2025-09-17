import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { BannerCarousel } from '../components/home/BannerCarousel';

export const HomePage: React.FC = () => (
  <Box>
    <Box sx={{ mb: 2 }}>
      <BannerCarousel />
    </Box>
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h6">Category Highlights</Typography></Grid>
      {[1,2,3,4].map(i => (
        <Grid item xs={12} sm={6} md={3} key={i}><Card variant="outlined"><CardContent>Category {i}</CardContent></Card></Grid>
      ))}
    </Grid>
  </Box>
);
