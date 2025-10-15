import Grid from '@mui/material/Grid'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../api/products'
import { useTranslation } from 'react-i18next'

export default function ProductDetail() {
  const { id = '' } = useParams()
  const { t, i18n } = useTranslation()
  const { data: product } = useQuery({ queryKey: ['vendor','product', id], queryFn: () => getProduct(id), enabled: !!id })
  if (!product) return null
  const language = i18n.language
  const productName = (p: any) => {
    if (language === 'ru') return p.nameRu || p.nameTk || p.sku
    if (language === 'tk') return p.nameTk || p.nameRu || p.sku
    return p.nameRu || p.nameTk || p.sku
  }
  const statusLabel = (status: string) => {
    if (status === 'active') return t('products.status.active')
    if (status === 'inactive') return t('products.status.inactive')
    return status
  }
  return (
    <>
      <BreadcrumbsNav />
      <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title={productName(product)} subheader={product.sku} />
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2 }}>{/* description optional */}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}><Info label={t('products.detail.price')} value={`$${Number(product.price).toFixed(2)}`} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label={t('products.detail.stock')} value={product.stock} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label={t('products.detail.unit')} value={product.unit} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label={t('products.detail.status')} value={<Chip size="small" label={statusLabel(product.status)} color={product.status === 'active' ? 'success' : 'default'} />} /></Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button href={`/products/${product.id}/edit`}>{t('products.detail.edit')}</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title={t('products.detail.inventory')} />
            <CardContent>
              <Info label={t('products.detail.inStock')} value={product.stock} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="subtitle1">{value}</Typography>
    </Box>
  )
}
