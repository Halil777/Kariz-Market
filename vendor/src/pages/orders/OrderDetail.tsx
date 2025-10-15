import { useMemo } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../../api/orders'
import { OrderStatusChip } from '../../components/orders/OrderStatusChip'
import { useTranslation } from 'react-i18next'

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

export default function OrderDetail() {
  const { t } = useTranslation()
  const params = useParams<{ id: string }>()
  const orderId = params.id ?? ''

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['vendor-order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
    retry: false,
  })

  const total = useMemo(() => (order ? formatCurrency(order.total, order.currency) : ''), [order])

  return (
    <>
      <BreadcrumbsNav />
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && isError && (
        <Alert severity="error">{t('orders.detail.error')}</Alert>
      )}
      {!isLoading && order && (
        <Card>
          <CardHeader
            title={t('orders.detail.title', { id: orderId.slice(-6) })}
            subheader={order.placedAt ? new Date(order.placedAt).toLocaleString() : t('orders.detail.noDate')}
            action={<OrderStatusChip status={order.status} />}
          />
          <CardContent>
            {order.status === 'cancelled' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {order.cancelledAt
                    ? t('orders.detail.cancelledAt', { date: new Date(order.cancelledAt).toLocaleString() })
                    : t('orders.detail.cancelled')}
                </Typography>
                <Typography variant="body2">
                  {order.cancellationReason || t('orders.detail.noReason')}
                </Typography>
              </Alert>
            )}

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('orders.detail.customer')}
                </Typography>
                <Typography>{order.customer?.displayName || order.customer?.email || t('orders.customerUnknown')}</Typography>
                {order.customer?.email && (
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.email}
                  </Typography>
                )}
                {order.customer?.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {order.customer.phone}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('orders.detail.items')}
                </Typography>
                {order.items.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('orders.detail.noItems')}
                  </Typography>
                ) : (
                  <Table size="small" sx={{ mb: 1 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('orders.detail.product')}</TableCell>
                        <TableCell align="right">{t('orders.detail.qty')}</TableCell>
                        <TableCell align="right">{t('orders.detail.subtotal')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.productName}
                            </Typography>
                            {item.productSku && (
                              <Typography variant="caption" color="text.secondary">
                                {t('orders.detail.sku', { sku: item.productSku })}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">{item.qty}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.subtotal, order.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <Typography variant="subtitle1" sx={{ textAlign: 'right', fontWeight: 600 }}>
                  {t('orders.detail.total')}: {total}
                </Typography>
              </Box>
            </Stack>

            <Link component={RouterLink} to="/orders" underline="hover">
              {t('orders.detail.back')}
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  )
}

