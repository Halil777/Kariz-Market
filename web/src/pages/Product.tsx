import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

export const ProductPage: React.FC = () => (
  <Box
    sx={{
      display: 'grid',
      gap: 2,
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
    }}
  >
    <Card variant="outlined" sx={{ height: 360 }}>
      <CardContent>Image Gallery</CardContent>
    </Card>
    <Box>
      <Typography variant="h5">Product Name</Typography>
      <Typography variant="h6" color="primary" sx={{ my: 1 }}>
        $99.00
      </Typography>
      <Button variant="contained" sx={{ mr: 1 }}>
        Add to Cart
      </Button>
      <Button variant="outlined">Wishlist</Button>
      <Box sx={{ mt: 2 }}>
        <Typography>Vendor info, stock, discount...</Typography>
      </Box>
    </Box>
    <Card variant="outlined" sx={{ gridColumn: '1 / -1' }}>
      <CardContent>Tabs: Description | Specifications | Reviews | Q&amp;A</CardContent>
    </Card>
  </Box>
);
