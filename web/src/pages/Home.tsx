import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export const HomePage: React.FC = () => (
  <Box>
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5">Hero Banner</Typography>
        <Typography variant="body2">Promotions and featured products</Typography>
      </CardContent>
    </Card>
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h6">Category Highlights</Typography></Grid>
      {[1,2,3,4].map(i => (
        <Grid item xs={12} sm={6} md={3} key={i}><Card variant="outlined"><CardContent>Category {i}</CardContent></Card></Grid>
      ))}
    </Grid>
  </Box>
);

