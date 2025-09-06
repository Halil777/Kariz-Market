import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Order = { id: string; customer: string; status: 'Completed' | 'Processing' | 'Pending' | 'Cancelled'; total: string };

const rows: Order[] = [
  { id: '#KAD001', customer: 'Alice Johnson', status: 'Completed', total: '$120.00' },
  { id: '#KAD002', customer: 'Bob Williams', status: 'Processing', total: '$85.50' },
  { id: '#KAD003', customer: 'Charlie Brown', status: 'Pending', total: '$210.25' },
  { id: '#KAD004', customer: 'Diana Prince', status: 'Completed', total: '$55.70' },
  { id: '#KAD005', customer: 'Eve Adams', status: 'Cancelled', total: '$15.00' },
];

const statusColor: Record<Order['status'], 'success' | 'warning' | 'info' | 'error'> = {
  Completed: 'success',
  Processing: 'info',
  Pending: 'warning',
  Cancelled: 'error',
};

export const RecentOrdersTable: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>{t('dashboard.recentOrders')}</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('dashboard.orderId')}</TableCell>
                <TableCell>{t('dashboard.customer')}</TableCell>
                <TableCell>{t('dashboard.status')}</TableCell>
                <TableCell align="right">{t('dashboard.total')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.customer}</TableCell>
                  <TableCell>
                    <Chip label={r.status} size="small" color={statusColor[r.status]} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{r.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
