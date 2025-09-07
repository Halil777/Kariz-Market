import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Drawer, Toolbar } from '@mui/material';

export const CatalogPage: React.FC = () => {
  return (
    <Box display="flex" gap={2}>
      <Drawer variant="permanent" open PaperProps={{ sx: { position: 'relative', width: 260, p: 2 } }}>
        <Toolbar />
        <Typography variant="h6">Filters</Typography>
        <Typography variant="body2">Category tree, price, brand, rating...</Typography>
      </Drawer>
      <Box flex={1}>
        <Grid container spacing={2}>
          {[...Array(12)].map((_, i) => (
            <Grid key={i} item xs={6} sm={4} md={3}>
              <Card variant="outlined"><CardContent><Typography>Product {i+1}</Typography></CardContent></Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

