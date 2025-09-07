import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Container } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Outlet, Link } from 'react-router-dom';
import { SearchBar } from '../components/common/SearchBar';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { Footer } from '../components/common/Footer';

export const AppLayout: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>Käriz Market</Typography>
          <Box flexGrow={1}><SearchBar /></Box>
          <LanguageSwitcher />
          <IconButton component={Link} to="/wishlist"><Badge color="secondary"><FavoriteBorderIcon /></Badge></IconButton>
          <IconButton component={Link} to="/cart"><Badge color="secondary"><ShoppingCartIcon /></Badge></IconButton>
          <IconButton component={Link} to="/account"><PersonOutlineIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ flex: 1, py: 2 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

