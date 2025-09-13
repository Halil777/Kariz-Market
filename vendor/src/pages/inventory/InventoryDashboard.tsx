import { Card, CardContent, CardHeader, Chip, Table, TableBody, TableCell, TableHead, TableRow, Divider, TableContainer, Paper } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

const rows = Array.from({ length: 20 }).map((_, i) => ({
  name: `Product ${i + 1}`,
  stock: Math.round(Math.random() * 50),
  threshold: 10,
}))

export default function InventoryDashboard() {
  return (
    <>
      <BreadcrumbsNav />
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Inventory" />
        <CardContent sx={{ p: 0 }}>
          <Divider />
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table size="small" sx={{ width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Alert</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{r.name}</TableCell>
                  <TableCell align="right">{r.stock}</TableCell>
                  <TableCell align="right">
                    {r.stock < r.threshold ? <Chip size="small" color="warning" label="Low" /> : <Chip size="small" color="success" label="OK" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  )
}
