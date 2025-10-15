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
import { ProductStatusChip, ProductStatus } from '@/components/products/ProductStatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, updateProduct, deleteProduct, type ProductDto } from '@/api/products';
import { fetchCategories, type CategoryDto } from '@/api/categories';
import AdminProductForm, { AdminProductFormValue } from '@/components/products/AdminProductForm';
import { absoluteAssetUrl } from '@/api/client';

type Row = ProductDto & { name: string };

export const ProductsPage: React.FC = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ['admin','products'], queryFn: fetchProducts });
  const { data: categories = [] } = useQuery({ queryKey: ['admin','categories','flat'], queryFn: fetchCategories });
  const mCreate = useMutation({ mutationFn: (p: any) => createProduct(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','products'] }) });
  const mUpdate = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: any }) => updateProduct(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','products'] }) });
  const mDelete = useMutation({ mutationFn: deleteProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','products'] }) });
  const [query, setQuery] = React.useState('');
  const [parentFilter, setParentFilter] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | ProductStatus>('all');
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<ProductDto | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const catMap = React.useMemo(() => new Map<string, CategoryDto>(categories.map((c: any) => [c.id, c])), [categories]);
  const parentOptions = React.useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const childOptions = React.useMemo(() => categories.filter((c) => c.parentId === parentFilter), [categories, parentFilter]);
  const descendantIds = React.useMemo(() => {
    if (!parentFilter) return new Set<string>();
    const set = new Set<string>();
    const addChildren = (pid: string) => {
      for (const c of categories) if (c.parentId === pid) { set.add(c.id); addChildren(c.id); }
    };
    addChildren(parentFilter);
    return set;
  }, [categories, parentFilter]);
  const rows: Row[] = React.useMemo(() => items.map((p) => ({ ...p, name: (p as any).nameTk || (p as any).nameRu || p.sku })), [items]) as any;
  const filtered = React.useMemo(() => rows.filter((p) => {
    const byStatus = (statusFilter === 'all' || p.status === statusFilter);
    const byQuery = (p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()));
    const byCategory = categoryFilter ? (p.categoryId === categoryFilter) : (parentFilter ? descendantIds.has(p.categoryId || '') : true);
    return byStatus && byQuery && byCategory;
  }), [rows, statusFilter, query, categoryFilter, parentFilter, descendantIds]);
  const paged = React.useMemo(() => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [filtered, page, rowsPerPage]);

  const openAdd = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (p: ProductDto) => { setEditing(p); setOpenForm(true); };

  const handleSubmit = (data: AdminProductFormValue) => {
    if (editing) {
      const { id: _omit, ...rest } = data;
      mUpdate.mutate({ id: editing.id, payload: rest });
    } else {
      const { id: _omit, ...rest } = data;
      mCreate.mutate(rest as any);
    }
    setOpenForm(false);
  };

  const confirmDelete = () => { if (deleteId) mDelete.mutate(deleteId); setDeleteId(null); };

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
        <Grid item xs={12} md={3}><TextField select fullWidth size="small" value={parentFilter} onChange={(e) => { setParentFilter(e.target.value); setCategoryFilter(''); setPage(0); }}><MenuItem value="">Category</MenuItem>{parentOptions.map((c: any) => (<MenuItem key={c.id} value={c.id}>{c.nameTk || c.name}</MenuItem>))}</TextField></Grid>
        <Grid item xs={12} md={3}><TextField select fullWidth size="small" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value as any); setPage(0); }} disabled={!parentFilter}><MenuItem value="">Subcategory</MenuItem>{childOptions.map((c: any) => (<MenuItem key={c.id} value={c.id}>{c.nameTk || c.name}</MenuItem>))}</TextField></Grid>
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
                  <TableCell>Image</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
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
                    <TableCell>{p.images?.length ? (<Avatar variant="rounded" sx={{ width: 32, height: 32 }} src={absoluteAssetUrl(p.images[0])} />) : (<Box sx={{ width: 32, height: 32, bgcolor: 'divider', borderRadius: 1 }} />)}</TableCell>
                    <TableCell><Typography fontWeight={600}>{(p as any).nameTk || (p as any).nameRu || p.sku}</Typography></TableCell>
                    <TableCell>{p.sku}</TableCell>
                    <TableCell>{(() => {
                      if ((p as any).categoryNameTk || (p as any).categoryNameRu) {
                        return (p as any).categoryNameTk || (p as any).categoryNameRu;
                      }
                      const c = p.categoryId ? (catMap.get(p.categoryId) as any) : undefined;
                      return c ? (c.nameTk || c.nameRu || c.name) : '';
                    })()}</TableCell>
                    <TableCell>{`$${Number(p.price).toFixed(2)}`}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell><ProductStatusChip status={p.status as any} /></TableCell>
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

      <AdminProductForm
        open={openForm}
        initial={editing ? {
          id: editing.id,
          sku: editing.sku,
          nameTk: (editing as any).nameTk,
          nameRu: (editing as any).nameRu,
          unit: editing.unit as any,
          price: Number(editing.price),
          compareAt: editing.compareAt ?? '',
          discountPct: Number(editing.discountPct),
          stock: editing.stock,
          images: editing.images || [],
          categoryId: editing.categoryId || '',
          status: editing.status as any,
          specs: (editing as any).specs || [],
        } : undefined}
        onClose={() => setOpenForm(false)}
        onSubmit={(val) => handleSubmit(val)}
      />
      <ConfirmDialog open={!!deleteId} title="Delete product?" description="This action cannot be undone." onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </>
  );
};
