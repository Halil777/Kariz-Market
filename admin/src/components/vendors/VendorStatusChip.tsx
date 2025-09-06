import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type VendorStatus = 'active' | 'suspended';

export const VendorStatusChip: React.FC<{ status: VendorStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const label = status === 'active' ? t('vendors.active') : t('vendors.suspended');
  const color = status === 'active' ? 'success' : 'warning';
  return <Chip size="small" color={color as any} variant="outlined" label={label} />;
};
