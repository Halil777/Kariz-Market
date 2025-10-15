import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { OrderStatus } from '../../api/orders'

const colorMap: Record<OrderStatus, 'default' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  processing: 'info',
  completed: 'success',
  cancelled: 'error',
}

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  const { t } = useTranslation()
  return <Chip size="small" variant="outlined" color={colorMap[status]} label={t(`orders.status.${status}`)} />
}

