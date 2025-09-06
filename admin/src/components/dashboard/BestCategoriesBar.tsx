import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Produce', sold: 460 },
  { name: 'Bakery', sold: 340 },
  { name: 'Dairy', sold: 300 },
  { name: 'Meat', sold: 280 },
  { name: 'Beverages', sold: 220 },
];

export const BestCategoriesBar: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>{t('dashboard.bestCategories')}</Typography>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip formatter={(v: any) => [v, t('dashboard.productsSold')]} />
              <Legend />
              <Bar dataKey="sold" name={t('dashboard.productsSold')} fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
