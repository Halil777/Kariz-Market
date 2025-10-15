import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { listOrders, type OrderStatus, type OrderSummary } from '@/api/orders';
import { OrderStatusChip } from '@/components/orders/OrderStatusChip';
import { OrderDetailsDrawer } from '@/components/orders/OrderDetailsDrawer';

const formatCurrency = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const formatOrderNumber = (id: string) => {
  if (!id) return '#—';
  const short = id.replace(/[^a-zA-Z0-9]/g, '').slice(-6);
  return `#${short || id.slice(0, 6)}`;
};

const statusOptions: Array<'all' | OrderStatus> = ['all', 'pending', 'processing', 'completed', 'cancelled'];

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<'all' | OrderStatus>('all');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState<OrderSummary | null>(null);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setSearch(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { data: orders = [], isFetching, isLoading } = useQuery<OrderSummary[]>({
    queryKey: ['orders', { status, search }],
    queryFn: () =>
      listOrders({
        status: status === 'all' ? undefined : status,
        q: search || undefined,
      }),
  });

  React.useEffect(() => {
    setPage(0);
  }, [status, search]);

  const pagedOrders = React.useMemo(
    () => orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [orders, page, rowsPerPage],
  );

  const statusCounts = React.useMemo(() => {
    const counters: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const order of orders) {
      counters[order.status] += 1;
    }
    return { total: orders.length, ...counters };
  }, [orders]);

  const renderVendorLabel = (order: OrderSummary) => {
    if (order.vendors.length === 0) return t('orders.vendorFallback');
    if (order.vendors.length === 1) return order.vendors[0].name;
    return t('orders.vendorMultiple', { count: order.vendors.length });
  };

  const renderCustomer = (order: OrderSummary) => {
    const name = order.customer?.displayName || order.customer?.email;
    if (!name) return t('orders.customerUnknown');
    return name;
  };

  const loading = isLoading || isFetching;

  return (
    <>
      <Box display="flex" alignItems={{ xs: 'stretch', md: 'center' }} flexWrap="wrap" gap={1.5} sx={{ mb: 2 }}>
        <Box flex={1} minWidth={200}>
          <Typography variant="h5">{t('orders.title')}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('orders.subtitle', { count: orders.length })}
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder={t('orders.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 240 }}
        />
        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'all' | OrderStatus)}
          sx={{ minWidth: 180 }}
        >
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {s === 'all' ? t('orders.statusFilter') : t(`orders.status.${s}`)}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orders.metrics.total')}
              </Typography>
              <Typography variant="h5">{statusCounts.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orders.metrics.pending')}
              </Typography>
              <Typography variant="h5">{statusCounts.pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orders.metrics.processing')}
              </Typography>
              <Typography variant="h5">{statusCounts.processing}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('orders.metrics.completed')}
              </Typography>
              <Typography variant="h5">{statusCounts.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('orders.columns.orderId')}</TableCell>
                  <TableCell>{t('orders.columns.customerName')}</TableCell>
                  <TableCell>{t('orders.columns.vendor')}</TableCell>
                  <TableCell>{t('orders.columns.date')}</TableCell>
                  <TableCell>{t('orders.columns.status')}</TableCell>
                  <TableCell align="right">{t('orders.columns.total')}</TableCell>
                  <TableCell align="right">{t('orders.columns.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={22} />
                    </TableCell>
                  </TableRow>
                )}
                {!loading && pagedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      {orders.length === 0 ? t('orders.empty') : t('orders.noResults')}
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  pagedOrders.map((order) => (
                    <TableRow key={order.id} hover sx={{ '& .MuiTableCell-root': { py: 0.9 } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{formatOrderNumber(order.id)}</TableCell>
                      <TableCell>{renderCustomer(order)}</TableCell>
                      <TableCell>{renderVendorLabel(order)}</TableCell>
                      <TableCell>
                        {order.placedAt ? new Date(order.placedAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <OrderStatusChip status={order.status} />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(order.total, order.currency)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                          <Tooltip title={t('orders.actions.view')}>
                            <IconButton size="small" onClick={() => setSelected(order)}>
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            onPageChange={(_, next) => setPage(next)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>

      <OrderDetailsDrawer open={Boolean(selected)} order={selected} onClose={() => setSelected(null)} />
    </>
  );
};

