import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type ProductStatus = 'active' | 'inactive';

export const ProductStatusChip: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const color = status === 'active' ? 'success' : 'error';
  const label = status === 'active' ? t('products.status.active') : t('products.status.inactive');
  return <Chip size="small" color={color as any} variant="outlined" label={label} />;
};

