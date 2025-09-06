import React from 'react';
import { Chip } from '@mui/material';

export type ProductStatus = 'active' | 'inactive';

export const ProductStatusChip: React.FC<{ status: ProductStatus }> = ({ status }) => {
  const color = status === 'active' ? 'success' : 'error';
  const label = status === 'active' ? 'Active' : 'Inactive';
  return <Chip size="small" color={color as any} variant="outlined" label={label} />;
};

