import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import { Footer } from '../components/common/Footer';

export const AppLayout: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container sx={{ flex: 1, py: 2 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

