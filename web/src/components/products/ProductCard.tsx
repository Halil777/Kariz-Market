import React from 'react';
import { Card, CardActionArea, Box, Typography, Chip, IconButton, Skeleton, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { toggle as toggleWishlist } from '../../store/slices/wishlistSlice';
import type { RootState } from '../../store/store';
import { toggleWishlist as apiToggleWishlist } from '../../api/wishlist';
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
  const [imgIndex, setImgIndex] = React.useState(0);

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
  const images = Array.isArray(product.images) && product.images.length ? product.images : [];
  const image = absoluteAssetUrl(images[imgIndex]);
  const unit = unitLabel(product.unit, t);
  const dispatch = useDispatch();
  const isWished = useSelector((s: RootState) => s.wishlist.ids.includes(product.id));
  const onToggleWish = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    try { await apiToggleWishlist(product.id); } catch {}
  };

  // Compute a sliding window of up to 5 dots with active centered
  const dotIndices = React.useMemo(() => {
    const n = images.length;
    if (n <= 5) return Array.from({ length: n }, (_, i) => i);
    if (imgIndex <= 2) return [0, 1, 2, 3, 4];
    if (imgIndex >= n - 3) return [n - 5, n - 4, n - 3, n - 2, n - 1];
    return [imgIndex - 2, imgIndex - 1, imgIndex, imgIndex + 1, imgIndex + 2];
  }, [images.length, imgIndex]);

  return (
    <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardActionArea component={RouterLink} to={product ? `/product/${product.id}` : '#'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}>
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
          {/* Hover only on dots to change image */}
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
            onClick={onToggleWish}
          >
            {isWished ? <FavoriteIcon fontSize="small" color="error" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          {/* Dots indicator under image (max 5 visible) */}
          {images.length > 1 && (
            <Stack direction="row" spacing={0.75} sx={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)' }}>
              {dotIndices.map((idx) => (
                <Box
                  key={idx}
                  onMouseEnter={() => setImgIndex(idx)}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: idx === imgIndex ? 'primary.main' : 'rgba(255,255,255,0.8)',
                    boxShadow: 1,
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Stack>
          )}
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
