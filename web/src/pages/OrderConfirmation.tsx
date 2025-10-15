import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../api/orders';
import type { OrderSummary } from '../api/orders';
import { OrderStatusChip } from '../components/orders/OrderStatusChip';
import { useTranslation } from 'react-i18next';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const orderFromState = (location.state as { order?: OrderSummary } | null)?.order;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id ?? ''),
    enabled: Boolean(id) && !orderFromState,
    initialData: orderFromState && id ? orderFromState : undefined,
  });

  const order = data ?? orderFromState;

  const formatPrice = React.useCallback((value: number, currency: string) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currency}`;
    }
  }, []);

  if (!id) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {t('orderConfirmation.missingId')}
      </Alert>
    );
  }

  if (isLoading && !order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {t('orderConfirmation.loadError')}
      </Alert>
    );
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 720, mx: 'auto', py: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {t('orderConfirmation.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t('orderConfirmation.subtitle', { id: order.id.slice(-6) })}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <OrderStatusChip status={order.status} />
            <Typography color="text.secondary">
              {order.placedAt
                ? t('orderConfirmation.placedAt', {
                    date: new Date(order.placedAt).toLocaleString(),
                  })
                : t('orderConfirmation.pendingPlacement')}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('orderConfirmation.itemsTitle')}
          </Typography>
          <List disablePadding>
            {order.items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={item.productName}
                    secondary={t('orderConfirmation.itemDetails', { qty: item.qty })}
                  />
                  <Typography>{formatPrice(item.subtotal, order.currency)}</Typography>
                </ListItem>
                {index < order.items.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            <Typography fontWeight={600}>{t('orderConfirmation.totalLabel')}</Typography>
            <Typography fontWeight={600}>{formatPrice(order.total, order.currency)}</Typography>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button component={Link} to="/account/orders" variant="contained">
          {t('orderConfirmation.viewOrders')}
        </Button>
        <Button component={Link} to="/" variant="outlined">
          {t('orderConfirmation.continueShopping')}
        </Button>
      </Stack>
    </Stack>
  );
};
