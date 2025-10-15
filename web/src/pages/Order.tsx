import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { clear as clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../api/orders';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const PAYMENT_STORAGE_KEY = 'kariz-payment-method';

type PaymentType = 'cash' | 'online';

export const OrderPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const items = useSelector((s: RootState) => s.cart.items);
  const orderItems = React.useMemo(() => items.filter((item) => item.qty > 0), [items]);
  const total = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [payment, setPayment] = React.useState<PaymentType>(() => {
    if (typeof window === 'undefined') {
      return 'cash';
    }
    const stored = window.localStorage.getItem(PAYMENT_STORAGE_KEY) as PaymentType | null;
    return stored === 'cash' || stored === 'online' ? stored : 'cash';
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setSubmitting] = React.useState(false);

  const formatPrice = React.useCallback((value: number) => {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'TMT' }).format(value);
    } catch {
      return `${value.toFixed(2)} m`;
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (orderItems.length === 0) {
      setError(t('orderPage.emptyCart'));
      return;
    }
    setSubmitting(true);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PAYMENT_STORAGE_KEY, payment);
      }
      const order = await createOrder({
        paymentMethod: payment,
        items: orderItems.map((item) => ({ variantId: item.id, qty: item.qty })),
      });
      dispatch(clearCart());
      queryClient.invalidateQueries({ queryKey: ['account-overview'] });
      queryClient.invalidateQueries({ queryKey: ['account-orders'] });
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        navigate('/login', { state: { from: '/order' } });
        return;
      }
      const message =
        (isAxiosError(err) && (err.response?.data as any)?.message) || t('orderPage.errorGeneric');
      setError(typeof message === 'string' ? message : t('orderPage.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 640, mx: 'auto', py: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {t('orderPage.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('orderPage.description')}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography sx={{ mb: 2 }}>{t('orderPage.info')}</Typography>
          <RadioGroup value={payment} onChange={(event) => setPayment(event.target.value as PaymentType)}>
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={t('orderPage.options.cash')}
            />
            <FormControlLabel
              value="online"
              control={<Radio />}
              label={t('orderPage.options.online')}
            />
          </RadioGroup>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('orderPage.summaryTitle')}
          </Typography>
          {orderItems.length === 0 ? (
            <Typography color="text.secondary">{t('orderPage.emptyCart')}</Typography>
          ) : (
            <>
              <List disablePadding>
                {orderItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={t('orderPage.quantity', { qty: item.qty })}
                      />
                      <Typography>{formatPrice(item.price * item.qty)}</Typography>
                    </ListItem>
                    {index < orderItems.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography fontWeight={600}>{t('orderPage.totalLabel')}</Typography>
                <Typography fontWeight={600}>{formatPrice(total)}</Typography>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t('orderPage.selected', { method: t(`orderPage.options.${payment}`) })}
        </Typography>
        <Button type="submit" variant="contained" size="large" disabled={isSubmitting || orderItems.length === 0}>
          {isSubmitting ? t('orderPage.submitting') : t('orderPage.proceed')}
        </Button>
      </Stack>
    </Box>
  );
};
