import React from 'react';
import { Box, Card, CardContent, Typography, Drawer, Toolbar } from '@mui/material';

export const CatalogPage: React.FC = () => {
  return (
    <Box display="flex" gap={2}>
      <Drawer variant="permanent" open PaperProps={{ sx: { position: 'relative', width: 260, p: 2 } }}>
        <Toolbar />
        <Typography variant="h6">Filters</Typography>
        <Typography variant="body2">Category tree, price, brand, rating...</Typography>
      </Drawer>
      <Box flex={1}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
              lg: 'repeat(5, minmax(0, 1fr))',
            },
          }}
        >
          {[...Array(12)].map((_, i) => (
            <Card key={i} variant="outlined">
              <CardContent>
                <Typography>Product {i + 1}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
