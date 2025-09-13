import { Card, CardContent, CardHeader, Chip, MenuItem, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Link, Divider, TableContainer, Paper } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { useState } from 'react'

const orders = Array.from({ length: 20 }).map((_, i) => ({
  id: `ORD-${1000 + i}`,
  customer: ['Alice', 'Bob', 'Charlie', 'Dana'][i % 4],
  date: `2025-09-${(i % 28) + 1}`,
  status: ['pending', 'shipped', 'delivered', 'cancelled'][i % 4] as 'pending' | 'shipped' | 'delivered' | 'cancelled',
  total: Math.round(40 + Math.random() * 300),
}))

export default function OrderList() {
  const [status, setStatus] = useState<'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled'>('all')
  const [q, setQ] = useState('')
  const filtered = orders.filter(
    (o) => (status === 'all' || o.status === status) && (o.id.includes(q) || o.customer.toLowerCase().includes(q.toLowerCase())),
  )
  return (
    <>
      <BreadcrumbsNav />
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Orders" />
        <CardContent sx={{ p: 0 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ p: 2 }}>
            <TextField label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
            <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)} sx={{ minWidth: 180 }}>
              {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Stack>
          <Divider />
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id} hover>
                    <TableCell>
                      <Link component={RouterLink} to={`/orders/${o.id}`}>{o.id}</Link>
                    </TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>{o.date}</TableCell>
                    <TableCell>
                      <Chip size="small" label={o.status} color={o.status === 'delivered' ? 'success' : o.status === 'pending' ? 'warning' : o.status === 'shipped' ? 'info' : 'default'} />
                    </TableCell>
                    <TableCell align="right">${o.total}</TableCell>
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
