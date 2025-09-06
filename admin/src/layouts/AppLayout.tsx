import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Tooltip, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LangSwitcher } from '@/components/common/LangSwitcher';

const navItems = [
  { to: '/', icon: <DashboardIcon />, labelKey: 'nav.dashboard' },
  { to: '/vendors', icon: <StoreIcon />, labelKey: 'nav.vendors' },
  { to: '/products', icon: <Inventory2Icon />, labelKey: 'nav.products' },
  { to: '/categories', icon: <CategoryIcon />, labelKey: 'nav.categories' },
  { to: '/orders', icon: <ReceiptLongIcon />, labelKey: 'nav.orders' },
  { to: '/customers', icon: <PeopleIcon />, labelKey: 'nav.customers' },
  { to: '/coupons', icon: <LocalOfferIcon />, labelKey: 'nav.coupons' },
  { to: '/reports', icon: <InsightsIcon />, labelKey: 'nav.reports' },
  { to: '/settings', icon: <SettingsIcon />, labelKey: 'nav.settings' },
];

const drawerWidth = 180;

export const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" color="default" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar variant="dense">
          <IconButton color="inherit" edge="start" onClick={() => setOpen((v) => !v)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{t('app.title')}</Typography>
          <Tooltip title="Notifications">
            <IconButton color="inherit"><NotificationsNoneIcon /></IconButton>
          </Tooltip>
          <LangSwitcher />
          <ThemeToggle />
          <IconButton sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{
        width: open ? drawerWidth : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: open ? drawerWidth : 64, boxSizing: 'border-box' }
      }}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => {
              const btn = (
                <ListItemButton key={item.to} component={Link} to={item.to} selected={pathname === item.to} sx={{ px: open ? 2 : 1.25 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.25 : 'auto', justifyContent: 'center', '& svg': { fontSize: 18 } }}>{item.icon}</ListItemIcon>
                  {open && <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={t(item.labelKey)} />}
                </ListItemButton>
              );
              return open ? btn : (
                <Tooltip key={item.to} title={t(item.labelKey)} placement="right">
                  <Box>{btn}</Box>
                </Tooltip>
              );
            })}
          </List>
          <Divider />
          <Box sx={{ p: 2, color: 'text.secondary' }}>v0.0.1</Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
