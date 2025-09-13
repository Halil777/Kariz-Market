import Grid from '@mui/material/Grid'
import { Card, CardContent, CardHeader, TextField, Button } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

export default function Profile() {
  return (
    <>
      <BreadcrumbsNav />
      <Card>
        <CardHeader title="Profile" />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Business Name" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Contact Email" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" /></Grid>
            <Grid size={{ xs: 12 }}><Button>Save</Button></Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
