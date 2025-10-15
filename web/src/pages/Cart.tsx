import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  TextField,
  Avatar,
  Drawer,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { updateQty, removeItem } from '../store/slices/cartSlice';
import { absoluteAssetUrl } from '../api/client';
import { useTranslation } from 'react-i18next';

type StoredUser = {
  name: string;
  phone: string;
  password: string;
};

export const CartPage: React.FC = () => {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return Boolean(window.localStorage.getItem('kariz-user'));
  });
  const [formValues, setFormValues] = React.useState<StoredUser>({
    name: '',
    phone: '',
    password: '',
  });

  const handleOrder = () => {
    if (items.length === 0) {
      return;
    }
    if (!isRegistered) {
      setDrawerOpen(true);
      return;
    }
    navigate('/order');
  };

  const handleInputChange = (field: keyof StoredUser) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof window === 'undefined') {
      return;
    }
    const trimmedValues = {
      name: formValues.name.trim(),
      phone: formValues.phone.trim(),
      password: formValues.password,
    };
    if (!trimmedValues.name || !trimmedValues.phone || !trimmedValues.password) {
      return;
    }
    window.localStorage.setItem('kariz-user', JSON.stringify(trimmedValues));
    setIsRegistered(true);
    setDrawerOpen(false);
    setFormValues({ name: '', phone: '', password: '' });
    navigate('/order');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>{t('cartPage.title')}</Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {items.map((it) => (
          <Stack key={it.id} direction="row" spacing={1} alignItems="center">
            <Avatar variant="rounded" src={absoluteAssetUrl(it.imageUrl)} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>{it.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('cartPage.priceEach', { price: it.price.toFixed(2) })}
              </Typography>
            </Box>
            <TextField
              size="small"
              type="number"
              inputProps={{ min: 1 }}
              value={it.qty}
              onChange={(e) =>
                dispatch(
                  updateQty({
                    id: it.id,
                    qty: Math.max(1, parseInt(e.target.value || '1', 10)),
                  }),
                )
              }
              sx={{ width: 80 }}
            />
            <Typography sx={{ width: 100, textAlign: 'right' }}>
              {(it.price * it.qty).toFixed(2)} m
            </Typography>
            <IconButton aria-label={t('cartPage.remove')} onClick={() => dispatch(removeItem(it.id))}>
              ✕
            </IconButton>
          </Stack>
        ))}
        {items.length === 0 && <Typography color="text.secondary">{t('cartPage.empty')}</Typography>}
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography fontWeight={700}>{t('cartPage.total')}</Typography>
        <Typography fontWeight={700}>{total.toFixed(2)} m</Typography>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="outlined" disabled={items.length === 0} component={Link} to="/checkout">
          {t('cartPage.checkout')}
        </Button>
        <Button variant="contained" disabled={items.length === 0} onClick={handleOrder}>
          {t('cartPage.order')}
        </Button>
      </Stack>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          component="form"
          onSubmit={handleRegister}
          sx={{
            width: { xs: '100vw', sm: 420 },
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('registration.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {t('registration.description')}
          </Typography>
          <TextField
            fullWidth
            required
            label={t('registration.name')}
            value={formValues.name}
            onChange={handleInputChange('name')}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            type="tel"
            label={t('registration.phone')}
            value={formValues.phone}
            onChange={handleInputChange('phone')}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            type="password"
            label={t('registration.password')}
            value={formValues.password}
            onChange={handleInputChange('password')}
            sx={{ mb: 3 }}
          />
          <Divider sx={{ mb: 3 }} />
          <Button type="submit" variant="contained">
            {t('registration.submit')}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};
