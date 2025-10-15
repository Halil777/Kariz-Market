import React from 'react';
import { Box, Typography, Button, Stack, IconButton, TextField, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { updateQty, removeItem } from '../store/slices/cartSlice';
import { absoluteAssetUrl } from '../api/client';
import { useTranslation } from 'react-i18next';

export const CartPage: React.FC = () => {
  const items = useSelector((s: RootState) => s.cart.items);
  const user = useSelector((s: RootState) => s.user.current);
  const dispatch = useDispatch();
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAuthenticated = React.useMemo(() => {
    if (user) return true;
    if (typeof window === 'undefined') return false;
    return Boolean(window.localStorage.getItem('customer.accessToken'));
  }, [user]);

  const handleOrder = () => {
    if (items.length === 0) {
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/order' } });
      return;
    }
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
      {!isAuthenticated && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {t('cartPage.loginPrompt')}{' '}
          <Button component={Link} to="/register" size="small">
            {t('cartPage.registerLink')}
          </Button>
        </Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="outlined" disabled={items.length === 0} component={Link} to="/checkout">
          {t('cartPage.checkout')}
        </Button>
        <Button variant="contained" disabled={items.length === 0} onClick={handleOrder}>
          {t('cartPage.order')}
        </Button>
      </Stack>
    </Box>
  );
};
