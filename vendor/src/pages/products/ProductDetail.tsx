import Grid from '@mui/material/Grid'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

export default function ProductDetail() {
  const product = {
    id: 'P-1001',
    name: 'Sample Product',
    sku: 'SKU-1001',
    category: 'Apparel',
    price: 59.99,
    stock: 42,
    status: 'active',
    description: 'A short product description goes here.',
    image: undefined as string | undefined,
  }
  return (
    <>
      <BreadcrumbsNav />
      <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title={product.name} subheader={product.sku} />
            <CardContent>
              <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Price" value={`$${product.price}`} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Stock" value={product.stock} /></Grid>
                <Grid size={{ xs: 6, md: 3 }}><Info label="Category" value={product.category} /></Grid>
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
