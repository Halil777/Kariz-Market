import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Stack,
  Divider,
  TableContainer,
  Paper,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import { Link } from 'react-router-dom'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

type Product = {
  id: string
  image?: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
}

const mock: Product[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `P-${1000 + i}`,
  name: `Product ${i + 1}`,
  sku: `SKU-${i + 1}`,
  category: ['Apparel', 'Electronics', 'Home'][i % 3],
  price: Math.round(20 + Math.random() * 200),
  stock: Math.round(Math.random() * 200),
  status: Math.random() > 0.2 ? 'active' : 'inactive',
}))

export default function ProductList() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [category, setCategory] = useState<'all' | string>('all')
  const [selected, setSelected] = useState<string[]>([])

  const filtered = useMemo(() => {
    return mock.filter((p) =>
      (status === 'all' || p.status === status) &&
      (category === 'all' || p.category === category) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase())),
    )
  }, [q, status, category])

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const allSelected = selected.length > 0 && selected.length === filtered.length

  return (
    <>
      <BreadcrumbsNav />
      <Card sx={{ width: '100%' }}>
        <CardHeader
          title="Products"
          action={<Button startIcon={<AddIcon />} component={Link} to="/products/new">Add Product</Button>}
        />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or SKU"
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              />
              <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)} sx={{ minWidth: 160 }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="all">All</MenuItem>
                {Array.from(new Set(mock.map((m) => m.category))).map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
              <Box flexGrow={1} />
              {selected.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <IconButton color="warning"><BlockIcon /></IconButton>
                  <IconButton color="error"><DeleteIcon /></IconButton>
                </Stack>
              )}
            </Stack>
          </Box>
          <Divider />
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && !allSelected}
                      checked={allSelected}
                      onChange={(e) => setSelected(e.target.checked ? filtered.map((f) => f.id) : [])}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    </TableCell>
                    <TableCell>
                      <Link to={`/products/${p.id}`}>{p.name}</Link>
                    </TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell align="right">${p.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{p.stock}</TableCell>
                    <TableCell>
                      <Chip size="small" label={p.status} color={p.status === 'active' ? 'success' : 'default'} />
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
