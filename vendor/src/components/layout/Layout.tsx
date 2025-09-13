import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Avatar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CategoryIcon2 from '@mui/icons-material/Category'
import SettingsIcon from '@mui/icons-material/Settings'
import CategoryIcon from '@mui/icons-material/Category'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleSidebar } from '../../store/uiSlice'
import ThemeToggle from '../common/ThemeToggle'
import LangSwitcher from '../common/LangSwitcher'
import Footer from './Footer'

const drawerWidth = 220

const items = [
  { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/products', icon: <CategoryIcon />, label: 'Products' },
  { to: '/categories', icon: <CategoryIcon2 />, label: 'Categories' },
  { to: '/orders', icon: <ShoppingCartIcon />, label: 'Orders' },
  { to: '/inventory', icon: <InventoryIcon />, label: 'Inventory' },
  { to: '/reports', icon: <AssessmentIcon />, label: 'Reports' },
  { to: '/settings/profile', icon: <SettingsIcon />, label: 'Account Settings' },
]

export default function Layout() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((s) => s.ui.sidebarOpen)
  const { pathname } = useLocation()
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" color="default" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar variant="dense">
          <IconButton color="inherit" edge="end" onClick={() => dispatch(toggleSidebar())} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Käriz Vendor Portal
          </Typography>
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>
          <LangSwitcher />
          <ThemeToggle />
          <IconButton sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>V</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List dense disablePadding>
            {items.map((item, idx) => {
              const btn = (
                <ListItemButton key={item.to} component={Link} to={item.to} selected={pathname === item.to} sx={{ px: open ? 2 : 1.25, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.25 : 'auto', justifyContent: 'center', '& svg': { fontSize: 18 } }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={item.label} />}
                </ListItemButton>
              )
              const node = open ? (
                btn
              ) : (
                <Tooltip key={item.to} title={item.label} placement="right">
                  <Box>{btn}</Box>
                </Tooltip>
              )
              return (
                <React.Fragment key={item.to}>
                  {node}
                  {idx < items.length - 1 && <Divider sx={{ my: 0 }} />}
                </React.Fragment>
              )
            })}
          </List>
          <Divider />
          <Box sx={{ p: 2, color: 'text.secondary' }}>v1.0.0</Box>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        <Outlet />
        <Footer />
      </Box>
    </Box>
  )
}
