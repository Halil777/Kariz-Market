import React from 'react';
import {
  Alert,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import type { OrderSummary } from '@/api/orders';
import { OrderStatusChip } from './OrderStatusChip';

type Props = {
  open: boolean;
  order: OrderSummary | null;
  onClose: () => void;
};

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
  const safe = id.replace(/[^a-zA-Z0-9]/g, '');
  const short = safe.slice(-6) || id.slice(0, 6);
  return `#${short}`;
};

export const OrderDetailsDrawer: React.FC<Props> = ({ open, order, onClose }) => {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 420, md: 520 } } }}
    >
      {order ? (
        <Box display="flex" flexDirection="column" height="100%">
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" px={3} py={2}>
            <Box>
              <Typography variant="h6">
                {t('orders.details.title', { id: formatOrderNumber(order.id) })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.placedAt
                  ? t('orders.details.placedAt', {
                      date: new Date(order.placedAt).toLocaleString(),
                    })
                  : t('orders.details.placedUnknown')}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider />
          <Box px={3} py={2} sx={{ overflowY: 'auto' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <OrderStatusChip status={order.status} />
              {order.updatedAt && (
                <Typography variant="body2" color="text.secondary">
                  {t('orders.details.updatedAt', {
                    date: new Date(order.updatedAt).toLocaleString(),
                  })}
                </Typography>
              )}
            </Stack>

            {order.status === 'cancelled' && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  {order.cancelledAt
                    ? t('orders.details.cancelledAt', {
                        date: new Date(order.cancelledAt).toLocaleString(),
                      })
                    : t('orders.details.cancelled')}
                </Typography>
                {order.cancellationReason ? (
                  <Typography variant="body2">{order.cancellationReason}</Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('orders.details.noCancellationReason')}
                  </Typography>
                )}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('orders.details.customer')}
              </Typography>
              <Typography>{order.customer?.displayName || order.customer?.email || t('orders.customerUnknown')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.customer?.email || '—'}
              </Typography>
              {order.customer?.phone && (
                <Typography variant="body2" color="text.secondary">
                  {order.customer.phone}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('orders.details.vendors')}
              </Typography>
              {order.vendors.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {order.vendors.map((vendor) => (
                    <Chip key={vendor.id} size="small" label={vendor.name} />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('orders.vendorFallback')}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t('orders.details.items')}
              </Typography>
              {order.items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('orders.details.noItems')}
                </Typography>
              ) : (
                <Table size="small" sx={{ mb: 1 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('orders.details.product')}</TableCell>
                      <TableCell>{t('orders.details.vendor')}</TableCell>
                      <TableCell align="right">{t('orders.details.qty')}</TableCell>
                      <TableCell align="right">{t('orders.details.subtotal')}</TableCell>
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
                              {t('orders.details.sku', { sku: item.productSku })}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{item.vendorName || t('orders.vendorFallback')}</TableCell>
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
                {t('orders.details.total')}: {formatCurrency(order.total, order.currency)}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box px={3} py={4}>
          <Typography>{t('orders.details.empty')}</Typography>
        </Box>
      )}
    </Drawer>
  );
};

