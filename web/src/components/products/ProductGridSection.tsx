import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ProductSummary } from '../../api/products';
import { ProductCard } from './ProductCard';

type Props = {
  title: string;
  products?: ProductSummary[];
  loading?: boolean;
  limit?: number;
};

export const ProductGridSection: React.FC<Props> = ({ title, products = [], loading = false, limit = 10 }) => {
  const { t } = useTranslation();
  const clampedLimit = Math.max(limit, 1);
  const loadingCards = React.useMemo(
    () => Array.from({ length: clampedLimit }, (_, index) => <ProductCard key={`loading-${index}`} loading />),
    [clampedLimit],
  );
  const productCards = React.useMemo(
    () => products.slice(0, clampedLimit).map((product) => <ProductCard key={product.id} product={product} />),
    [products, clampedLimit],
  );
  const hasItems = loading ? loadingCards.length > 0 : productCards.length > 0;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      {hasItems ? (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
              lg: 'repeat(5, minmax(0, 1fr))',
            },
          }}
        >
          {loading ? loadingCards : productCards}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('home.emptySection')}
        </Typography>
      )}
    </Box>
  );
};

export default ProductGridSection;
