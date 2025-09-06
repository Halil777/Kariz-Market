import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', total: 15000 },
  { name: 'Feb', total: 18000 },
  { name: 'Mar', total: 24000 },
  { name: 'Apr', total: 20000 },
  { name: 'May', total: 28000 },
  { name: 'Jun', total: 30000 },
  { name: 'Jul', total: 32000 },
];

export const SalesLineChart: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>{t('dashboard.salesOverTime')}</Typography>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, t('dashboard.totalSales')]} />
              <Legend />
              <Line type="monotone" dataKey="total" name={t('dashboard.totalSales')} stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
