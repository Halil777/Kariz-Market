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
  TablePagination,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import { Link } from 'react-router-dom'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct, fetchProducts, type ProductDto } from '../../api/products'
import { fetchCategories, type CategoryDto } from '../../api/categories'
import { absoluteAssetUrl } from '../../api/upload'

type Row = ProductDto & { name: string }

export default function ProductList() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [parentFilter, setParentFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const qc = useQueryClient()
  const { data: items = [] } = useQuery({ queryKey: ['vendor','products', categoryFilter], queryFn: () => fetchProducts(categoryFilter || undefined) })
  const { data: categories = [] } = useQuery({ queryKey: ['vendor','categories','flat'], queryFn: fetchCategories })
  const mDelete = useMutation({ mutationFn: deleteProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ['vendor','products'] }) })
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const catMap = useMemo(() => new Map<string, CategoryDto>(categories.map((c: any) => [c.id, c])) , [categories])
  const parentOptions = useMemo(() => categories.filter((c) => !c.parentId), [categories])
  const childOptions = useMemo(() => categories.filter((c) => c.parentId === parentFilter), [categories, parentFilter])

  const descendantIds = useMemo(() => {
    if (!parentFilter) return new Set<string>()
    const set = new Set<string>()
    const addChildren = (parentId: string) => {
      for (const c of categories) {
        if (c.parentId === parentId) {
          set.add(c.id)
          addChildren(c.id)
        }
      }
    }
    addChildren(parentFilter)
    return set
  }, [parentFilter, categories])

  const rows: Row[] = useMemo(() => items.map((p) => ({
    ...p,
    name: (p as any).nameTk || (p as any).nameRu || p.sku,
    category: '',
  })) as any, [items])
  const filtered = useMemo(() => rows.filter((p) => {
    const byStatus = (status === 'all' || p.status === status)
    const byQuery = (p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
    const byCategory = categoryFilter ? (p.categoryId === categoryFilter) : (parentFilter ? descendantIds.has(p.categoryId || '') : true)
    return byStatus && byQuery && byCategory
  }), [q, status, rows, categoryFilter, parentFilter, descendantIds])
  const paged = useMemo(() => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filtered, page, rowsPerPage])

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
              <TextField select label="Category" value={parentFilter} onChange={(e) => { setParentFilter(e.target.value); setCategoryFilter(''); setPage(0) }} sx={{ minWidth: 200 }}>
                <MenuItem value="">All</MenuItem>
                {parentOptions.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>{c.nameTk || c.name}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Subcategory" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0) }} sx={{ minWidth: 200 }} disabled={!parentFilter}>
                <MenuItem value="">All</MenuItem>
                {childOptions.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>{c.nameTk || c.name}</MenuItem>
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
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    </TableCell>
                    <TableCell>
                      {p.images?.length ? (
                        <img src={absoluteAssetUrl(p.images[0])} alt="thumb" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                      ) : (
                        <Box sx={{ width: 40, height: 40, bgcolor: 'divider', borderRadius: 1 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link to={`/products/${p.id}`}>{p.name}</Link>
                    </TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{(() => { const c = p.categoryId ? catMap.get(p.categoryId) as any : undefined; return c ? (c.nameTk || c.name) : '' })()}</TableCell>
                    <TableCell align="right">${Number(p.price).toFixed(2)}</TableCell>
                    <TableCell align="right">{p.stock}</TableCell>
                    <TableCell>
                      <Chip size="small" label={p.status} color={p.status === 'active' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="error" onClick={() => mDelete.mutate(p.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ px: 2 }}>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, p: number) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
