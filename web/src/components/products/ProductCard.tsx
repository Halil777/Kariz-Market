import React from 'react';
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Chip,
  IconButton,
  Skeleton,
  Stack,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useTranslation } from 'react-i18next';
import { absoluteAssetUrl } from '../../api/client';
import type { ProductSummary } from '../../api/products';

type Props = {
  product?: ProductSummary;
  loading?: boolean;
};

const formatPrice = (value: number, language: 'ru' | 'tk') => {
  const formatter = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'tk-TM', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  });
  return `${formatter.format(value)} m`;
};

const unitLabel = (unit: string | undefined, t: (key: string) => string) => {
  switch ((unit || '').toLowerCase()) {
    case 'kg':
      return t('product.units.kg');
    case 'l':
      return t('product.units.l');
    case 'count':
    case 'pcs':
    case 'pc':
    case 'san':
      return t('product.units.count');
    default:
      return unit || '';
  }
};

export const ProductCard: React.FC<Props> = ({ product, loading = false }) => {
  const { i18n, t } = useTranslation();
  const language: 'ru' | 'tk' = i18n.language?.toLowerCase().startsWith('ru') ? 'ru' : 'tk';

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3 }}>
        <Skeleton variant="rectangular" height={200} animation="wave" />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" animation="wave" />
          <Skeleton variant="text" width="80%" animation="wave" />
          <Skeleton variant="text" width="40%" animation="wave" />
        </Box>
      </Card>
    );
  }

  if (!product) return null;

  const name = language === 'ru' ? product.nameRu ?? product.nameTk : product.nameTk ?? product.nameRu;
  const rawCategory = language === 'ru'
    ? product.categoryNameRu ?? product.categoryNameTk
    : product.categoryNameTk ?? product.categoryNameRu;
  const categoryName = rawCategory && rawCategory.trim().length > 0 ? rawCategory.trim() : null;
  const priceValue = product.price ?? 0;
  const compareAtRaw = product.compareAt ?? null;
  const price = formatPrice(priceValue, language);
  const compareAt = compareAtRaw && compareAtRaw > priceValue ? formatPrice(compareAtRaw, language) : null;
  const discount = product.discountPct && Number(product.discountPct) > 0
    ? Math.round(Number(product.discountPct))
    : null;
  const image = absoluteAssetUrl(product.images?.[0]);
  const unit = unitLabel(product.unit, t);

  return (
    <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200,
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          {image ? (
            <Box
              component="img"
              src={image}
              alt={name || t('product.untitled')}
              loading="lazy"
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <Skeleton variant="rectangular" animation="wave" sx={{ width: '100%', height: '100%' }} />
          )}
          {discount && (
            <Chip
              size="small"
              color="error"
              label={t('product.discountBadge', { value: discount })}
              sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 700 }}
            />
          )}
          <IconButton
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.85)' }}
            aria-label={t('product.wishlist')}
          >
            <FavoriteBorderIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.75, flexGrow: 1, width: '100%' }}>
          <Typography variant="caption" color="text.secondary" noWrap>
            {categoryName || t('product.uncategorized')}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap title={name || undefined}>
            {name || t('product.untitled')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 'auto' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              {price}
            </Typography>
            {unit && (
              <Typography variant="body2" color="text.secondary">
                {unit}
              </Typography>
            )}
            {compareAt && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 'auto' }}>
                {compareAt}
              </Typography>
            )}
          </Stack>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;