import { useState, useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Chip,
  Divider,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useQuery } from '@tanstack/react-query'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { listOrders, type OrderStatus, type OrderSummary } from '../../api/orders'
import { OrderStatusChip } from '../../components/orders/OrderStatusChip'
import { useTranslation } from 'react-i18next'

const statusFilters: Array<'all' | OrderStatus> = ['all', 'pending', 'processing', 'completed', 'cancelled']

const formatCurrency = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

const formatOrderNumber = (id: string) => {
  const safe = id.replace(/[^a-zA-Z0-9]/g, '')
  return `#${safe.slice(-6) || id.slice(0, 6)}`
}

export default function OrderList() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'all' | OrderStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: orders = [], isLoading, isFetching } = useQuery<OrderSummary[]>({
    queryKey: ['vendor-orders', status],
    queryFn: () => listOrders({ status: status === 'all' ? undefined : status }),
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter((order) => {
      const customer = order.customer?.displayName || order.customer?.email || ''
      return order.id.toLowerCase().includes(q) || customer.toLowerCase().includes(q)
    })
  }, [orders, query])

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  )

  const loading = isLoading || isFetching

  const summary = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    }
    orders.forEach((order) => {
      counts[order.status] += 1
    })
    return counts
  }, [orders])

  return (
    <>
      <BreadcrumbsNav />
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title={t('orders.title')}
          subheader={t('orders.subtitle', { count: orders.length })}
        />
        <CardContent sx={{ p: 0 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(0)
              }}
              placeholder={t('orders.search')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              label={t('orders.filters.status')}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'all' | OrderStatus)
                setPage(0)
              }}
              sx={{ minWidth: 180 }}
            >
              {statusFilters.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === 'all' ? t('orders.filters.allStatuses') : t(`orders.status.${option}`)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} sx={{ px: 2, py: 1.5 }}>
            <Chip label={t('orders.summary.pending', { count: summary.pending })} color="warning" variant="outlined" />
            <Chip label={t('orders.summary.processing', { count: summary.processing })} color="info" variant="outlined" />
            <Chip label={t('orders.summary.completed', { count: summary.completed })} color="success" variant="outlined" />
            <Chip label={t('orders.summary.cancelled', { count: summary.cancelled })} color="default" variant="outlined" />
          </Stack>

          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('orders.table.order')}</TableCell>
                  <TableCell>{t('orders.table.customer')}</TableCell>
                  <TableCell>{t('orders.table.date')}</TableCell>
                  <TableCell>{t('orders.table.status')}</TableCell>
                  <TableCell align="right">{t('orders.table.total')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                )}
                {!loading && paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">{t('orders.table.empty')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  paged.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Link component={RouterLink} to={`/orders/${order.id}`} underline="hover">
                          {formatOrderNumber(order.id)}
                        </Link>
                      </TableCell>
                      <TableCell>{order.customer?.displayName || order.customer?.email || t('orders.customerUnknown')}</TableCell>
                      <TableCell>
                        {order.placedAt ? new Date(order.placedAt).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        <OrderStatusChip status={order.status} />
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(order.total, order.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, value) => setPage(value)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>
    </>
  )
}

