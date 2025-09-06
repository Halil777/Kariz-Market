import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Stack,
  Checkbox,
  TablePagination,
  InputAdornment,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import { ProductFormDialog, Product } from '@/components/products/ProductFormDialog';
import { ProductStatusChip, ProductStatus } from '@/components/products/ProductStatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const initialProducts: Product[] = [
  { id: '1', image: '', name: 'Organic Apples', sku: 'SKU12345', vendor: 'Green Valley Farms', category: 'Fruits', price: 2.5, stock: 150, status: 'active' },
  { id: '2', image: '', name: 'Whole Wheat Bread', sku: 'SKU67890', vendor: 'Sunrise Bakery', category: 'Bakery', price: 3.0, stock: 80, status: 'active' },
  { id: '3', image: '', name: 'Free-Range Eggs', sku: 'SKU24680', vendor: 'Happy Hen Farm', category: 'Dairy & Eggs', price: 4.0, stock: 100, status: 'active' },
  { id: '4', image: '', name: 'Almond Milk', sku: 'SKU13579', vendor: 'Nutty Delights', category: 'Beverages', price: 3.5, stock: 120, status: 'active' },
  { id: '5', image: '', name: 'Ground Beef', sku: 'SKU97531', vendor: "Butcher's Choice", category: 'Meat & Seafood', price: 6.0, stock: 50, status: 'inactive' },
];

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [query, setQuery] = React.useState('');
  const [vendorFilter, setVendorFilter] = React.useState<'all' | string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = React.useState<'all' | ProductStatus>('all');
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const vendors = Array.from(new Set(products.map((p) => p.vendor)));
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchesQuery = [p.name, p.sku, p.vendor, p.category].some((f) => f.toLowerCase().includes(query.toLowerCase()));
    const matchesVendor = vendorFilter === 'all' ? true : p.vendor === vendorFilter;
    const matchesCategory = categoryFilter === 'all' ? true : p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
    return matchesQuery && matchesVendor && matchesCategory && matchesStatus;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const openAdd = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (p: Product) => { setEditing(p); setOpenForm(true); };

  const handleSubmit = (data: Partial<Product>) => {
    if (editing) {
      setProducts((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...data } as Product : x)));
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        name: String(data.name || ''),
        sku: String(data.sku || ''),
        vendor: String(data.vendor || ''),
        category: String(data.category || ''),
        price: Number(data.price || 0),
        stock: Number(data.stock || 0),
        status: (data.status as ProductStatus) || 'active',
        image: data.image || '',
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setOpenForm(false);
  };

  const confirmDelete = () => {
    if (deleteId) setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const toggleSelect = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const allSelected = paged.length > 0 && paged.every((p) => selected[p.id]);
  const toggleSelectAll = () => {
    const upd: Record<string, boolean> = { ...selected };
    paged.forEach((p) => { upd[p.id] = !allSelected; });
    setSelected(upd);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>Products</Typography>
      <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={12} md={3}>
          <TextField select fullWidth size="small" value={vendorFilter} onChange={(e) => { setVendorFilter(e.target.value as any); setPage(0); }}>
            <MenuItem value="all">Vendor</MenuItem>
            {vendors.map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField select fullWidth size="small" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value as any); setPage(0); }}>
            <MenuItem value="all">Category</MenuItem>
            {categories.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField select fullWidth size="small" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0); }}>
            <MenuItem value="all">Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" variant="outlined" startIcon={<FilterAltOutlinedIcon />}>Bulk Actions</Button>
            <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Product</Button>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            size="small"
          />
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"><Checkbox checked={allSelected} onChange={toggleSelectAll} /></TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((p) => (
                  <TableRow key={p.id} hover sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                    <TableCell padding="checkbox"><Checkbox checked={!!selected[p.id]} onChange={() => toggleSelect(p.id)} /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar variant="rounded" sx={{ width: 32, height: 32 }} src={p.image}>
                          <Box sx={{ width: 18, height: 18, bgcolor: 'success.light', borderRadius: 1 }} />
                        </Avatar>
                        <Typography fontWeight={600}>{p.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{p.vendor}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{`$${p.price.toFixed(2)}`}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell><ProductStatusChip status={p.status} /></TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => openEdit(p)}><EditOutlinedIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(p.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Chip label="No products found" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ px: 2 }}>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Box>
        </CardContent>
      </Card>

      <ProductFormDialog open={openForm} initial={editing} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
      <ConfirmDialog open={!!deleteId} title="Delete product?" description="This action cannot be undone." onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </>
  );
};
