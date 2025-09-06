import React from 'react';
import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

type Props = {
  title: string;
  value: string | number;
  delta?: number; // percent change
  positive?: boolean;
  icon?: React.ReactNode;
  currency?: string;
};

export const StatCard: React.FC<Props> = ({ title, value, delta, positive, icon, currency }) => {
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mt: 0.5 }}>
              {currency && (
                <Typography variant="subtitle2" color="text.secondary">{currency}</Typography>
              )}
              <Typography variant="h6">{value}</Typography>
            </Stack>
            {typeof delta === 'number' && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                {positive ? (
                  <ArrowUpwardIcon color="success" sx={{ fontSize: 16 }} />
                ) : (
                  <ArrowDownwardIcon color="error" sx={{ fontSize: 16 }} />
                )}
                <Typography variant="caption" color={positive ? 'success.main' : 'error.main'}>
                  {positive ? '+' : ''}{delta.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">{t('dashboard.fromLastPeriod')}</Typography>
              </Stack>
            )}
          </Box>
          <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
