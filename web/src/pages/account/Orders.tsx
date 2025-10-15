import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { cancelOrder, listOrders, type OrderStatus, type OrderSummary } from '../../api/orders';
import { OrderStatusChip } from '../../components/orders/OrderStatusChip';
import { CancelOrderDialog } from '../../components/orders/CancelOrderDialog';

const isCancellable = (status: OrderStatus) => status === 'pending' || status === 'processing';

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

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [cancelTarget, setCancelTarget] = React.useState<OrderSummary | null>(null);

  const { data: orders = [], isLoading, isFetching } = useQuery({
    queryKey: ['account-orders'],
    queryFn: listOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => cancelOrder(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-orders'] });
    },
  });

  const statusSummary = React.useMemo(() => {
    const totals: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const order of orders) totals[order.status] += 1;
    return totals;
  }, [orders]);

  const handleCancel = (reason: string) => {
    if (!cancelTarget) return;
    cancelMutation.mutate({ id: cancelTarget.id, reason });
    setCancelTarget(null);
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader
          title={t('accountOrders.title')}
          subheader={t('accountOrders.subtitle', { count: orders.length })}
        />
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <SummaryBadge label={t('accountOrders.summary.pending')} value={statusSummary.pending} color="warning" />
            <SummaryBadge label={t('accountOrders.summary.processing')} value={statusSummary.processing} color="info" />
            <SummaryBadge label={t('accountOrders.summary.completed')} value={statusSummary.completed} color="success" />
            <SummaryBadge label={t('accountOrders.summary.cancelled')} value={statusSummary.cancelled} color="default" />
          </Stack>
        </CardContent>
      </Card>

      {(isLoading || isFetching) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && orders.length === 0 && (
        <Alert severity="info">{t('accountOrders.empty')}</Alert>
      )}

      <Stack spacing={2}>
        {orders.map((order) => {
          const vendors = Array.from(
            new Set(order.items.map((item) => item.vendorName).filter(Boolean)),
          ) as string[];
          return (
            <Accordion
              key={order.id}
              expanded={expanded === order.id}
              onChange={(_, isExpanded) => setExpanded(isExpanded ? order.id : false)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t('accountOrders.orderNumber', { id: order.id.slice(-6) })}
                    </Typography>
                    <OrderStatusChip status={order.status} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {order.placedAt
                        ? t('accountOrders.placedAt', { date: new Date(order.placedAt).toLocaleString() })
                        : t('accountOrders.placedUnknown')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatCurrency(order.total, order.currency)}
                    </Typography>
                  </Stack>
                  {vendors.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {t('accountOrders.vendors', { count: vendors.length, names: vendors.join(', ') })}
                    </Typography>
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {order.status === 'cancelled' && (
                    <Alert severity="warning">
                      <Typography variant="subtitle2" gutterBottom>
                        {order.cancelledAt
                          ? t('accountOrders.cancelledAt', {
                              date: new Date(order.cancelledAt).toLocaleString(),
                            })
                          : t('accountOrders.cancelled')}
                      </Typography>
                      <Typography variant="body2">
                        {order.cancellationReason || t('accountOrders.noReason')}
                      </Typography>
                    </Alert>
                  )}

                  <Stack spacing={1}>
                    {order.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 1.5,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        <Typography sx={{ fontWeight: 600 }}>{item.productName}</Typography>
                        {item.productSku && (
                          <Typography variant="caption" color="text.secondary">
                            {t('accountOrders.sku', { sku: item.productSku })}
                          </Typography>
                        )}
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            {t('accountOrders.quantity', { count: item.qty })}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatCurrency(item.subtotal, order.currency)}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>

                  <Divider />
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t('accountOrders.totalDue', { amount: formatCurrency(order.total, order.currency) })}
                    </Typography>
                    {isCancellable(order.status) && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setCancelTarget(order)}
                        disabled={cancelMutation.isPending}
                      >
                        {t('accountOrders.actions.cancel')}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>

      <CancelOrderDialog
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onSubmit={handleCancel}
      />
      {cancelMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t('accountOrders.cancel.error')}
        </Alert>
      )}
    </Box>
  );
};

type SummaryBadgeProps = {
  label: string;
  value: number;
  color: 'warning' | 'info' | 'success' | 'default';
};

const SummaryBadge: React.FC<SummaryBadgeProps> = ({ label, value, color }) => {
  const borderColor = color === 'default' ? 'divider' : `${color}.light`;
  const textColor = color === 'default' ? 'text.secondary' : `${color}.dark`;
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor,
        px: 2,
        py: 1,
        minWidth: 140,
      }}
    >
      <Typography variant="body2" color={textColor} sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  );
};

