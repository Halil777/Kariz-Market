import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PAYMENT_STORAGE_KEY = 'kariz-payment-method';

type PaymentType = 'cash' | 'online';

export const OrderPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [payment, setPayment] = React.useState<PaymentType>(() => {
    if (typeof window === 'undefined') {
      return 'cash';
    }
    const stored = window.localStorage.getItem(PAYMENT_STORAGE_KEY) as PaymentType | null;
    return stored === 'cash' || stored === 'online' ? stored : 'cash';
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PAYMENT_STORAGE_KEY, payment);
    }
    navigate('/checkout');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 520, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {t('orderPage.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('orderPage.description')}
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography sx={{ mb: 2 }}>{t('orderPage.info')}</Typography>
          <RadioGroup
            value={payment}
            onChange={(event) => setPayment(event.target.value as PaymentType)}
          >
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
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t('orderPage.selected', { method: t(`orderPage.options.${payment}`) })}
        </Typography>
        <Button type="submit" variant="contained">
          {t('orderPage.proceed')}
        </Button>
      </Stack>
    </Box>
  );
};
