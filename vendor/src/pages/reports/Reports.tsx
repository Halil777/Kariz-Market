import Grid from '@mui/material/Grid'
import { Card, CardContent, CardHeader, Button, Stack } from '@mui/material'
import ChartLine from '../../components/common/ChartLine'
import ChartBar from '../../components/common/ChartBar'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

const sales = Array.from({ length: 12 }).map((_, i) => ({ month: `M${i + 1}`, value: Math.round(1000 + Math.random() * 4000) }))
const best = Array.from({ length: 5 }).map((_, i) => ({ name: `Product ${i + 1}`, revenue: Math.round(500 + Math.random() * 2000) }))

export default function Reports() {
  return (
    <>
      <BreadcrumbsNav />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title="Sales Report" action={<ExportButtons />} />
            <CardContent>
              <ChartLine data={sales} xKey="month" yKey="value" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Best Selling Products" />
            <CardContent>
              <ChartBar data={best} xKey="name" yKey="revenue" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

function ExportButtons() {
  return (
    <Stack direction="row" spacing={1}>
      <Button variant="outlined">Excel</Button>
      <Button variant="outlined">CSV</Button>
      <Button variant="outlined">PDF</Button>
    </Stack>
  )
}
