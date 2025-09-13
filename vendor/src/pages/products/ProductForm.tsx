import { useState } from 'react'
import Grid from '@mui/material/Grid'
import { Box, Button, Card, CardContent, CardHeader, MenuItem, Switch, TextField, Typography } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

export default function ProductForm() {
  const [active, setActive] = useState(true)
  return (
    <>
      <BreadcrumbsNav />
      <Card>
        <CardHeader title="Add / Edit Product" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth label="Name" required sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="SKU" required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Category" select>
                    {['Apparel', 'Electronics', 'Home'].map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Price" type="number" inputProps={{ min: 0, step: '0.01' }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Discount (%)" type="number" inputProps={{ min: 0, max: 100 }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Stock Quantity" type="number" inputProps={{ min: 0 }} />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Description"
                multiline
                minRows={5}
                placeholder="Rich text editor placeholder"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Upload Images</Typography>
                <Button sx={{ mt: 1 }} component="label">Choose Files
                  <input hidden type="file" multiple accept="image/*" />
                </Button>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Status</Typography>
                <Switch checked={active} onChange={(e) => setActive(e.target.checked)} />
                <Typography color={active ? 'success.main' : 'text.secondary'}>{active ? 'Active' : 'Inactive'}</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Box display="flex" gap={1}>
                <Button color="primary">Save</Button>
                <Button variant="outlined">Cancel</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
