import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, CardContent, Grid, TextField, Typography, useTheme, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getOverview } from '@/api/reports';
import { getWishlistRegistered, getWishlistGuests, getCartRegistered, getCartGuests } from '@/api/engagement';
import { StatCard } from '@/components/dashboard/StatCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [from, setFrom] = React.useState<string>(() => {
    const to = new Date();
    const fromD = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000);
    return fromD.toISOString().slice(0, 10);
  });
  const [to, setTo] = React.useState<string>(() => new Date().toISOString().slice(0, 10));

  const { data } = useQuery({
    queryKey: ['reports','overview', from, to],
    queryFn: () => getOverview(from, to),
  });
  const { data: wlReg = [] } = useQuery({ queryKey: ['engagement','wishlist','registered'], queryFn: getWishlistRegistered });
  const { data: wlGuest = [] } = useQuery({ queryKey: ['engagement','wishlist','guests'], queryFn: getWishlistGuests });
  const { data: cartReg = [] } = useQuery({ queryKey: ['engagement','cart','registered'], queryFn: getCartRegistered });
  const { data: cartGuest = [] } = useQuery({ queryKey: ['engagement','cart','guests'], queryFn: getCartGuests });

  const totals = data?.totals || { revenue: 0, orders: 0, avgOrderValue: 0, newCustomers: 0 };
  const chartData = (data?.salesByDay || []).map((d) => ({ name: d.date.slice(5), total: d.revenue }));

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">{t('nav.reports')}</Typography>
        <Box display="flex" gap={1}>
          <TextField size="small" type="date" label={t('From', { defaultValue: 'From' })} value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField size="small" type="date" label={t('To', { defaultValue: 'To' })} value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}><StatCard title={t('dashboard.totalSales')} value={`$${totals.revenue.toLocaleString()}`} delta={0} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title={t('dashboard.totalOrders')} value={totals.orders} delta={0} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title={t('reports.avgOrderValue', { defaultValue: 'Avg Order Value' })} value={`$${totals.avgOrderValue.toFixed(2)}`} delta={0} /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title={t('reports.newCustomers', { defaultValue: 'New Customers' })} value={totals.newCustomers} delta={0} /></Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>{t('dashboard.salesOverTime')}</Typography>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid stroke={theme.palette.divider} />
                <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, t('dashboard.totalSales')]} />
                <Line type="monotone" dataKey="total" name={t('dashboard.totalSales')} stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Wishlist — Registered</Typography>
              <Table size="small"><TableHead><TableRow><TableCell>User ID</TableCell><TableCell align="right">Items</TableCell></TableRow></TableHead><TableBody>
                {wlReg.map((r:any) => (<TableRow key={r.userId}><TableCell>{r.userId}</TableCell><TableCell align="right">{r.count}</TableCell></TableRow>))}
              </TableBody></Table></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Wishlist — Guests</Typography>
              <Table size="small"><TableHead><TableRow><TableCell>Device ID</TableCell><TableCell align="right">Items</TableCell></TableRow></TableHead><TableBody>
                {wlGuest.map((r:any) => (<TableRow key={r.deviceId}><TableCell>{r.deviceId}</TableCell><TableCell align="right">{r.count}</TableCell></TableRow>))}
              </TableBody></Table></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Cart — Registered</Typography>
              <Table size="small"><TableHead><TableRow><TableCell>User ID</TableCell><TableCell align="right">Qty</TableCell></TableRow></TableHead><TableBody>
                {cartReg.map((r:any) => (<TableRow key={r.userId}><TableCell>{r.userId}</TableCell><TableCell align="right">{r.count}</TableCell></TableRow>))}
              </TableBody></Table></CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Cart — Guests</Typography>
              <Table size="small"><TableHead><TableRow><TableCell>Device ID</TableCell><TableCell align="right">Qty</TableCell></TableRow></TableHead><TableBody>
                {cartGuest.map((r:any) => (<TableRow key={r.deviceId}><TableCell>{r.deviceId}</TableCell><TableCell align="right">{r.count}</TableCell></TableRow>))}
              </TableBody></Table></CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

