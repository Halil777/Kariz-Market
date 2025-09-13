import Grid from '@mui/material/Grid'
import { Card, CardContent, CardHeader, TextField, Button } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

export default function Business() {
  return (
    <>
      <BreadcrumbsNav />
      <Card>
        <CardHeader title="Business Settings" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Bank Account" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Tax ID" /></Grid>
            <Grid size={{ xs: 12 }}><Button>Save</Button></Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
