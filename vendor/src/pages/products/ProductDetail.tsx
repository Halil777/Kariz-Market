import Grid from '@mui/material/Grid'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../api/products'

export default function ProductDetail() {
  const { id = '' } = useParams()
  const { data: product } = useQuery({ queryKey: ['vendor','product', id], queryFn: () => getProduct(id), enabled: !!id })
  if (!product) return null
  return (
    <>
      <BreadcrumbsNav />
      <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title={(product as any).nameTk || (product as any).nameRu || product.sku} subheader={product.sku} />
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2 }}>{/* description optional */}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Price" value={`$${Number(product.price).toFixed(2)}`} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Stock" value={product.stock} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Unit" value={product.unit} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Status" value={<Chip size="small" label={product.status} color="success" />} /></Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button href={`/products/${product.id}/edit`}>Edit</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Inventory" />
            <CardContent>
              <Info label="In Stock" value={product.stock} />
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
