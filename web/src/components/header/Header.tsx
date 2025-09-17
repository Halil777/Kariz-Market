import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Container,
  Typography,
  Link as MLink,
  Divider,
} from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: (t) => t.zIndex.appBar }}>
      {/* Top bar: logo + catalog + big search + actions */}
      <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1.5, py: 1 }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'primary.contrastText',
                fontWeight: 900,
                mr: 1,
                letterSpacing: 0.5,
              }}
            >
              Kariz
            </Typography>

            {/* Catalog pill button */}
            <Button
              component={Link}
              to="/catalog"
              startIcon={<AppsIcon />}
              sx={{
                borderRadius: 999,
                px: 2.5,
                height: 44,
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'primary.main' },
              }}
              variant="contained"
              color="secondary"
            >
              Каталог
            </Button>

            {/* Big search with location selector on the left */}
            <Box sx={{ flex: 1, mx: 1.5, display: { xs: 'none', sm: 'flex' } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 999,
                  px: 1,
                  py: 0.5,
                  width: '100%',
                  border: '2px solid',
                  borderColor: 'primary.light',
                }}
              >
                <Button
                  size="small"
                  startIcon={<PlaceOutlinedIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 999,
                    color: 'text.primary',
                    bgcolor: 'action.hover',
                    px: 1.5,
                    mr: 1,
                    minWidth: 0,
                  }}
                >
                  Везде
                </Button>
                <Box component="input"
                  placeholder="Искать на Kariz"
                  aria-label="search"
                  sx={{
                    flex: 1,
                    border: 0,
                    outline: 'none',
                    fontSize: 16,
                    px: 1,
                    bgcolor: 'transparent',
                    color: 'text.primary',
                  }}
                />
                <IconButton type="submit" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Action icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.contrastText' }}>
              <IconButton component={Link} to="/account" color="inherit">
                <Badge variant="dot" color="secondary" overlap="circular">
                  <PersonOutlineIcon />
                </Badge>
              </IconButton>
              <IconButton component={Link} to="/wishlist" color="inherit">
                <FavoriteBorderIcon />
              </IconButton>
              <IconButton component={Link} to="/cart" color="inherit">
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Secondary links bar */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters variant="dense" sx={{ gap: 2, minHeight: 44 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', color: 'text.secondary' }}>
            
              <MLink component={Link} to="/catalog" underline="none" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CreditCardOutlinedIcon fontSize="small" /> Ozon Карта
              </MLink>
              <MLink component={Link} to="/catalog" underline="none" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FlightOutlinedIcon fontSize="small" /> Билеты, отели
              </MLink>
              <MLink component={Link} to="/catalog" underline="none" color="inherit" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BusinessCenterOutlinedIcon fontSize="small" /> Для бизнеса
              </MLink>
              <MLink component={Link} to="/catalog" underline="none" color="inherit">Одежда, обувь</MLink>
              <MLink component={Link} to="/catalog" underline="none" color="inherit">Электроника</MLink>
              <MLink component={Link} to="/catalog" underline="none" color="inherit">Дом и сад</MLink>
              <MLink component={Link} to="/catalog" underline="none" color="inherit">Товары за 1₽</MLink>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <PlaceOutlinedIcon fontSize="small" />
              <Typography variant="body2">Москва</Typography>
              <Divider flexItem orientation="vertical" />
              <MLink component={Link} to="#" underline="hover" color="primary">Укажите адрес</MLink>
            </Box>
          </Toolbar>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;
