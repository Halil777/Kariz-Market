import Grid from '@mui/material/Grid'
import { Card, CardHeader, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import StatCard from '../components/common/StatCard'
import ChartLine from '../components/common/ChartLine'
import ChartBar from '../components/common/ChartBar'
import BreadcrumbsNav from '../components/common/BreadcrumbsNav'

const sales = [
  { day: 'Mon', value: 240 },
  { day: 'Tue', value: 310 },
  { day: 'Wed', value: 180 },
  { day: 'Thu', value: 420 },
  { day: 'Fri', value: 380 },
  { day: 'Sat', value: 520 },
  { day: 'Sun', value: 290 },
]

const topProducts = [
  { name: 'Product A', sales: 120 },
  { name: 'Product B', sales: 95 },
  { name: 'Product C', sales: 80 },
  { name: 'Product D', sales: 60 },
]

const recentOrders = [
  { id: 'ORD-1001', customer: 'Alice', date: '2025-09-01', status: 'Pending' },
  { id: 'ORD-1002', customer: 'Bob', date: '2025-09-02', status: 'Shipped' },
  { id: 'ORD-1003', customer: 'Charlie', date: '2025-09-03', status: 'Delivered' },
  { id: 'ORD-1004', customer: 'Dana', date: '2025-09-03', status: 'Cancelled' },
  { id: 'ORD-1005', customer: 'Eve', date: '2025-09-04', status: 'Pending' },
]

export default function Dashboard() {
  return (
    <>
      <BreadcrumbsNav />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Sales" value="$24,300" subtitle="Last 7 days" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Orders" value={438} subtitle="Last 7 days" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Products" value={128} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending Shipments" value={19} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title="Sales Over Time" />
            <CardContent>
              <ChartLine data={sales} xKey="day" yKey="value" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Top-selling Products" />
            <CardContent>
              <ChartBar data={topProducts} xKey="name" yKey="sales" />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="Recent Orders" />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((o) => (
                    <TableRow key={o.id} hover>
                      <TableCell>{o.id}</TableCell>
                      <TableCell>{o.customer}</TableCell>
                      <TableCell>{o.date}</TableCell>
                      <TableCell>{o.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
