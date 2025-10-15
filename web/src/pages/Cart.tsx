import React from 'react';
import { Box, Typography, Button, Stack, IconButton, TextField, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { updateQty, removeItem } from '../store/slices/cartSlice';
import { absoluteAssetUrl } from '../api/client';

export const CartPage: React.FC = () => {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();
  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Shopping Cart</Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {items.map((it) => (
          <Stack key={it.id} direction="row" spacing={1} alignItems="center">
            <Avatar variant="rounded" src={absoluteAssetUrl(it.imageUrl)} />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600}>{it.name}</Typography>
              <Typography variant="caption" color="text.secondary">{it.price.toFixed(2)} m each</Typography>
            </Box>
            <TextField size="small" type="number" inputProps={{ min: 1 }} value={it.qty}
              onChange={(e) => dispatch(updateQty({ id: it.id, qty: Math.max(1, parseInt(e.target.value || '1', 10)) }))}
              sx={{ width: 80 }} />
            <Typography sx={{ width: 100, textAlign: 'right' }}>{(it.price * it.qty).toFixed(2)} m</Typography>
            <IconButton onClick={() => dispatch(removeItem(it.id))}>✕</IconButton>
          </Stack>
        ))}
        {items.length === 0 && <Typography color="text.secondary">Your cart is empty</Typography>}
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography fontWeight={700}>Total</Typography>
        <Typography fontWeight={700}>{total.toFixed(2)} m</Typography>
      </Stack>
      <Button variant="contained" disabled={items.length === 0} component={Link} to="/checkout">Checkout</Button>
    </Box>
  );
};
