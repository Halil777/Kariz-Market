import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  InputAdornment,
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
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { VendorFormDialog, Vendor } from '@/components/vendors/VendorFormDialog';
import { VendorStatusChip, VendorStatus } from '@/components/vendors/VendorStatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useTranslation } from 'react-i18next';

const initialVendors: Vendor[] = [
  { id: '1', name: 'Aşgabat Market', email: 'asgabat@example.com', phone: '+993-12-345678', status: 'active', createdAt: '2023-01-15' },
  { id: '2', name: 'Türkmen Bazar', email: 'turkmenbazar@example.com', phone: '+993-61-123456', status: 'suspended', createdAt: '2023-02-20' },
  { id: '3', name: 'Ahal Söwda', email: 'ahal@example.com', phone: '+993-62-246801', status: 'active', createdAt: '2023-03-10' },
  { id: '4', name: 'Balkan Market', email: 'balkan@example.com', phone: '+993-63-135792', status: 'active', createdAt: '2023-04-05' },
  { id: '5', name: 'Mary Market', email: 'mary@example.com', phone: '+993-65-369121', status: 'suspended', createdAt: '2023-05-12' },
  { id: '6', name: 'Lebap Söwda', email: 'lebap@example.com', phone: '+993-64-753951', status: 'active', createdAt: '2023-06-18' },
  { id: '7', name: 'Daýhan', email: 'dayhan@example.com', phone: '+993-66-8642107', status: 'active', createdAt: '2023-07-22' },
  { id: '8', name: 'Altyn Gül', email: 'altyngul@example.com', phone: '+993-67-9553218', status: 'suspended', createdAt: '2023-08-28' },
  { id: '9', name: 'Gül Zaman', email: 'gulzaman@example.com', phone: '+993-68-0564329', status: 'active', createdAt: '2023-09-14' },
  { id: '10', name: 'Bereketli Söwda', email: 'bereketli@example.com', phone: '+993-69-1975430', status: 'active', createdAt: '2023-10-01' },
];

export const VendorsPage: React.FC = () => {
  const { t } = useTranslation();
  const [vendors, setVendors] = React.useState<Vendor[]>(initialVendors);
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | VendorStatus>('all');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Vendor | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const filtered = vendors.filter((v) => {
    const matchesQuery = [v.name, v.email, v.phone].some((f) => f.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ? true : v.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const openAdd = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (v: Vendor) => { setEditing(v); setOpenForm(true); };

  const handleSubmit = (data: Partial<Vendor>) => {
    if (editing) {
      setVendors((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...data } as Vendor : p)));
    } else {
      const now = new Date().toISOString().slice(0, 10);
      const newVendor: Vendor = { id: String(Date.now()), name: String(data.name || ''), email: String(data.email || ''), phone: String(data.phone || ''), status: (data.status as VendorStatus) || 'active', createdAt: now };
      setVendors((prev) => [newVendor, ...prev]);
    }
    setOpenForm(false);
  };

  const confirmDelete = () => {
    if (deleteId) setVendors((prev) => prev.filter((v) => v.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>{t('vendors.title')}</Typography>
      <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder={t('vendors.search')}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField select fullWidth value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0); }} size="small">
            <MenuItem value="all">{t('vendors.status')}</MenuItem>
            <MenuItem value="active">{t('vendors.active')}</MenuItem>
            <MenuItem value="suspended">{t('vendors.suspended')}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }}>
          <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={openAdd}>{t('vendors.addVendor')}</Button>
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('vendors.vendorName')}</TableCell>
                  <TableCell>{t('vendors.email')}</TableCell>
                  <TableCell>{t('vendors.phone')}</TableCell>
                  <TableCell>{t('vendors.status')}</TableCell>
                  <TableCell>{t('vendors.createdDate')}</TableCell>
                  <TableCell align="right">{t('vendors.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((v) => (
                  <TableRow key={v.id} hover sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                    <TableCell><strong>{v.name}</strong></TableCell>
                    <TableCell>{v.email}</TableCell>
                    <TableCell>{v.phone}</TableCell>
                    <TableCell><VendorStatusChip status={v.status} /></TableCell>
                    <TableCell>{v.createdAt}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => openEdit(v)}><EditOutlinedIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(v.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">{t('vendors.noResults')}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardContent>
      </Card>

      <VendorFormDialog open={openForm} initial={editing} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
      <ConfirmDialog open={!!deleteId} title={t('vendors.deleteVendor')} description={t('vendors.deleteDescription')} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </>
  );
};
