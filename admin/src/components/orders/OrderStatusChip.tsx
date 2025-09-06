import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

const colorMap: Record<OrderStatus, 'default' | 'info' | 'success' | 'error'> = {
  Pending: 'default',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'error',
};

export const OrderStatusChip: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const label = t(`orders.status.${status}`);
  return <Chip size="small" color={colorMap[status]} variant="outlined" label={label} />;
};
