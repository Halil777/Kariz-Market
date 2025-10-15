import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { OrderStatus } from '../../api/orders';

const colorMap: Record<OrderStatus, 'default' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  processing: 'info',
  completed: 'success',
  cancelled: 'error',
};

export const OrderStatusChip: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const { t } = useTranslation();
  return <Chip size="small" label={t(`accountOrders.status.${status}`)} color={colorMap[status]} variant="outlined" />;
};

