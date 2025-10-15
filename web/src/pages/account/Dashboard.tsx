import React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { fetchAccountOverview } from '../../api/account';
import { OrderStatusChip } from '../../components/orders/OrderStatusChip';
import { useDispatch } from 'react-redux';
import { logout as logoutAction, setUser } from '../../store/slices/userSlice';

const formatCurrency = (value: number, currency = 'TMT') => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

export const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['account-overview'],
    queryFn: fetchAccountOverview,
    retry: (failureCount, err) => {
      if (isAxiosError(err) && err.response?.status === 401) return false;
      return failureCount < 2;
    },
  });

  React.useEffect(() => {
    if (data?.user) {
      dispatch(setUser({
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.displayName ?? null,
        phone: data.user.phone ?? null,
        loyaltyPoints: data.stats.loyaltyPoints,
        createdAt: data.user.createdAt,
      }));
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('customer.accessToken');
      localStorage.removeItem('customer.refreshToken');
    } catch {
      // ignore
    }
    dispatch(logoutAction());
    queryClient.removeQueries({ queryKey: ['account-overview'] });
    queryClient.removeQueries({ queryKey: ['account-orders'] });
    navigate('/login');
  };

  const unauthorized = isError && isAxiosError(error) && error.response?.status === 401;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (unauthorized || !data) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 520, mx: 'auto' }}>
        <CardHeader title="Welcome to your account" subheader="Sign in to view your profile and orders." />
        <CardContent>
          <Stack spacing={2}>
            <Typography>
              Create an account or sign in to access your orders, loyalty balance and saved preferences.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button component={Link} to="/login" variant="contained">
                Sign in
              </Button>
              <Button component={Link} to="/register" variant="outlined">
                Create account
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const { user, stats, recentOrders } = data;
  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Avatar sx={{ width: 72, height: 72, fontSize: 28 }}>{initials}</Avatar>
            <Box flex={1}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.displayName || user.email}
              </Typography>
              <Typography color="text.secondary">{user.email}</Typography>
              {user.phone && (
                <Typography color="text.secondary">{user.phone}</Typography>
              )}
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={`Member since ${formatDate(user.createdAt)}`} size="small" />
                <Chip label={`${stats.loyaltyPoints} loyalty pts`} size="small" color="primary" variant="outlined" />
              </Stack>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="contained" component={Link} to="/account/orders">
                View orders
              </Button>
              <Button variant="outlined" onClick={handleLogout}>
                Log out
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Total orders" value={stats.totalOrders.toString()} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Active orders" value={stats.openOrders.toString()} helper="Pending or processing" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Loyalty points" value={stats.loyaltyPoints.toString()} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Total spent"
            value={formatCurrency(stats.totalSpent, recentOrders[0]?.currency || 'TMT')}
            helper={stats.lastOrderAt ? `Last order ${formatDate(stats.lastOrderAt)}` : undefined}
          />
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardHeader title="Recent activity" subheader="Your latest orders and statuses" action={<Button component={Link} to="/account/orders">Order history</Button>} />
        <Divider />
        <CardContent>
          {recentOrders.length === 0 ? (
            <Alert severity="info">You have not placed any orders yet.</Alert>
          ) : (
            <List disablePadding>
              {recentOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem alignItems="flex-start" disableGutters sx={{ py: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          Order #{order.id.slice(-6)}
                        </Typography>
                        <OrderStatusChip status={order.status} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Placed {order.placedAt ? new Date(order.placedAt).toLocaleString() : '—'} · {order.itemCount}{' '}
                        item{order.itemCount === 1 ? '' : 's'}
                      </Typography>
                      {order.vendors.length > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Sold by {order.vendors.map((vendor) => vendor.name).join(', ')}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {formatCurrency(order.total, order.currency)}
                    </Typography>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, helper }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      {helper && (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      )}
    </CardContent>
  </Card>
);
