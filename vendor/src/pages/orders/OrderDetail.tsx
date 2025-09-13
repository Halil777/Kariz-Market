import Grid from '@mui/material/Grid'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

export default function OrderDetail() {
  const order = {
    id: 'ORD-1001',
    customer: { name: 'Alice', email: 'alice@example.com', phone: '+1 555 1234' },
    shipping: { address: '123 Main St, City', courier: 'DHL', tracking: 'DHL-XYZ-123' },
    payment: { status: 'paid' as 'paid' | 'pending' | 'refunded' },
    items: [
      { name: 'Product A', qty: 2, price: 20 },
      { name: 'Product B', qty: 1, price: 50 },
    ],
  }

  const total = order.items.reduce((s, it) => s + it.qty * it.price, 0)

  return (
    <>
      <BreadcrumbsNav />
      <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title={`Order ${order.id}`} />
            <CardContent>
              <Typography variant="subtitle1">Order Items</Typography>
              <Table size="small" sx={{ mb: 2 }}>
                <TableBody>
                  {order.items.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{it.name}</TableCell>
                      <TableCell>Qty: {it.qty}</TableCell>
                      <TableCell align="right">${it.qty * it.price}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2}><strong>Total</strong></TableCell>
                    <TableCell align="right"><strong>${total}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="subtitle1">Customer</Typography>
              <Box>{order.customer.name} · {order.customer.email} · {order.customer.phone}</Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Shipping</Typography>
              <Box>{order.shipping.address} · {order.shipping.courier} · {order.shipping.tracking}</Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Payment</Typography>
              <Box>Status: {order.payment.status}</Box>
            </CardContent>
            <CardActions>
              <Button>Mark as Shipped</Button>
              <Button color="warning" variant="outlined">Cancel</Button>
              <Button color="error" variant="outlined">Refund</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
