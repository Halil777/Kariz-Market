import React from 'react';
import { Box, Button, Chip, Container, Grid, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { absoluteAssetUrl } from '../../api/client';
import { fetchWishlist, toggleWishlist as apiToggleWishlist } from '../../api/wishlist';
import { fetchProduct, type ProductSummary } from '../../api/products';
import { useDispatch } from 'react-redux';
import { set as setWishlist, toggle as toggleWishlist } from '../../store/slices/wishlistSlice';
import type { AppDispatch } from '../../store/store';
import type { TFunction } from 'i18next';

type WishlistEntry = { id: string; productId: string };

type WishlistItemCardProps = {
  product: ProductSummary;
  index: number;
  language: 'ru' | 'tk';
  onRemove: (id: string) => void;
  t: TFunction<'translation'>;
};

const formatPrice = (value: number, language: 'ru' | 'tk') => {
  const formatter = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'tk-TM', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  });
  return `${formatter.format(value)} m`;
};

const unitLabel = (unit: string | undefined, t: TFunction<'translation'>) => {
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

const WishlistItemCard: React.FC<WishlistItemCardProps> = ({ product, index, language, onRemove, t }) => {
  const name = language === 'ru' ? product.nameRu ?? product.nameTk : product.nameTk ?? product.nameRu;
  const rawCategory = language === 'ru'
    ? product.categoryNameRu ?? product.categoryNameTk
    : product.categoryNameTk ?? product.categoryNameRu;
  const categoryName = rawCategory && rawCategory.trim().length > 0 ? rawCategory.trim() : null;
  const price = product.price ? formatPrice(product.price, language) : null;
  const compareAtRaw = product.compareAt ?? null;
  const compareAt = compareAtRaw && product.price && compareAtRaw > product.price
    ? formatPrice(compareAtRaw, language)
    : null;
  const discount = product.discountPct && Number(product.discountPct) > 0
    ? Math.round(Number(product.discountPct))
    : null;
  const image = Array.isArray(product.images) && product.images.length > 0
    ? absoluteAssetUrl(product.images[0])
    : null;
  const stock = typeof product.stock === 'number' ? product.stock : null;
  const unit = unitLabel(product.unit, t);

  return (
    <Box
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      whileHover={{ translateY: -8, boxShadow: '0 24px 55px rgba(15, 23, 42, 0.16)' }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, delay: index * 0.05 }}
      sx={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(148, 163, 184, 0.18)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        backdropFilter: 'blur(18px)',
      }}
    >
      <Box sx={{ position: 'relative', pt: '66%', overflow: 'hidden', bgcolor: 'grey.100' }}>
        <Box
          component={motion.div}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          {image ? (
            <Box
              component={motion.img}
              src={image}
              alt={name || t('product.untitled')}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)',
              }}
            />
          )}
        </Box>
        {discount && (
          <Chip
            size="small"
            color="error"
            label={t('product.discountBadge', { value: discount })}
            sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 700 }}
          />
        )}
        <IconButton
          size="small"
          aria-label={t('wishlistPage.remove')}
          onClick={() => onRemove(product.id)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'error.light', color: 'common.white' },
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
      <Stack spacing={2} sx={{ p: 3, flexGrow: 1 }}>
        <Stack spacing={0.5}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.6 }}>
            {categoryName || t('product.uncategorized')}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {name || t('product.untitled')}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="baseline">
          {price && (
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
              {price}
            </Typography>
          )}
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
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            variant={stock && stock > 0 ? 'filled' : 'outlined'}
            color={stock && stock > 0 ? 'success' : 'default'}
            icon={stock && stock > 0
              ? <CheckCircleOutlineIcon fontSize="small" />
              : <HourglassEmptyIcon fontSize="small" />}
            label={stock && stock > 0
              ? t('wishlistPage.inStock', { count: stock })
              : t('wishlistPage.outOfStock')}
            sx={{ borderRadius: 999, fontWeight: 600 }}
          />
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ mt: 'auto' }}>
          <Button
            component={RouterLink}
            to={`/product/${product.id}`}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            fullWidth
            sx={{
              py: 1.25,
              fontWeight: 600,
              borderRadius: 999,
              textTransform: 'none',
            }}
          >
            {t('wishlistPage.viewProduct')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export const WishlistPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language: 'ru' | 'tk' = i18n.language?.toLowerCase().startsWith('ru') ? 'ru' : 'tk';
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const { data: wishlistEntries = [], isLoading: isWishlistLoading, isError } = useQuery<WishlistEntry[]>({
    queryKey: ['wishlist', 'entries'],
    queryFn: fetchWishlist,
    staleTime: 60_000,
    onSuccess: (entries) => {
      dispatch(setWishlist(entries.map((entry) => entry.productId)));
    },
  });

  const productIds = React.useMemo(
    () => wishlistEntries.map((entry) => entry.productId).filter(Boolean),
    [wishlistEntries],
  );

  const { data: products = [], isLoading: isProductsLoading } = useQuery<ProductSummary[]>({
    queryKey: ['wishlist', 'products', productIds],
    queryFn: async () => {
      const result = await Promise.all(
        productIds.map(async (id) => {
          try {
            return await fetchProduct(id);
          } catch {
            return null;
          }
        }),
      );
      return result.filter((item): item is ProductSummary => Boolean(item));
    },
    enabled: productIds.length > 0,
    keepPreviousData: true,
  });

  const isLoading = isWishlistLoading || (productIds.length > 0 && isProductsLoading);

  const handleRemove = React.useCallback(async (productId: string) => {
    dispatch(toggleWishlist(productId));
    try {
      await apiToggleWishlist(productId);
      await queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } catch {
      dispatch(toggleWishlist(productId));
    }
  }, [dispatch, queryClient]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(120% 120% at 50% 0%, rgba(59, 130, 246, 0.07) 0%, rgba(255,255,255,1) 65%)',
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          sx={{ textAlign: { xs: 'left', md: 'center' }, mb: 6 }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            {t('wishlistPage.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t('wishlistPage.subtitle')}
          </Typography>
        </Box>

        {isLoading && (
          <Box sx={{ py: 6 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('wishlistPage.loading')}
            </Typography>
            <Grid container spacing={3}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ borderRadius: 4, overflow: 'hidden', backgroundColor: 'white', boxShadow: 4 }}>
                    <Skeleton variant="rectangular" height={240} />
                    <Box sx={{ p: 3 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                      <Skeleton variant="text" width="50%" />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {!isLoading && isError && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              borderRadius: 4,
              p: 4,
              backgroundColor: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {t('wishlistPage.errorTitle', { defaultValue: 'Connection error' })}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('wishlistPage.errorDescription', { defaultValue: 'We could not load your wishlist. Please try again shortly.' })}
            </Typography>
          </Box>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <AnimatePresence mode="popLayout">
            <Grid container spacing={3}>
              {products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <WishlistItemCard
                    product={product}
                    index={index}
                    language={language}
                    onRemove={handleRemove}
                    t={t}
                  />
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            sx={{
              mt: 6,
              borderRadius: 5,
              px: { xs: 4, md: 8 },
              py: { xs: 6, md: 10 },
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(59, 130, 246, 0.16))',
              textAlign: 'center',
              boxShadow: '0 30px 60px rgba(30, 64, 175, 0.15)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              {t('wishlistPage.emptyTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 4 }}>
              {t('wishlistPage.emptyDescription')}
            </Typography>
            <Button
              component={RouterLink}
              to="/catalog"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {t('wishlistPage.browseButton')}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WishlistPage;
