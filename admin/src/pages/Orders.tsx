import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  TablePagination,
  Stack,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { OrderFormDialog, Order } from '@/components/orders/OrderFormDialog';
import { OrderStatusChip, OrderStatus } from '@/components/orders/OrderStatusChip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useTranslation } from 'react-i18next';

const vendorOptions = ['Aşgabat Market', 'Türkmen Bazar', 'Ahal Söwda'];

const initialOrders: Order[] = [
  { id: '#12345', customer: 'Batyr Amanow', vendor: vendorOptions[0], date: '2024-01-15', status: 'Pending', total: 150 },
  { id: '#12346', customer: 'Aýna Rejepowa', vendor: vendorOptions[1], date: '2024-01-16', status: 'Shipped', total: 200 },
  { id: '#12347', customer: 'Güljemal Orazowa', vendor: vendorOptions[0], date: '2024-01-17', status: 'Delivered', total: 100 },
  { id: '#12348', customer: 'Merdan Yazmämmedow', vendor: vendorOptions[2], date: '2024-01-18', status: 'Cancelled', total: 50 },
  { id: '#12349', customer: 'Serdar Rahmanow', vendor: vendorOptions[1], date: '2024-01-19', status: 'Pending', total: 120 },
  { id: '#12350', customer: 'Leyla Nurmämmedowa', vendor: vendorOptions[0], date: '2024-01-20', status: 'Shipped', total: 180 },
  { id: '#12351', customer: 'Yhlas Hojayew', vendor: vendorOptions[2], date: '2024-01-21', status: 'Delivered', total: 90 },
  { id: '#12352', customer: 'Amanmyrat Atayew', vendor: vendorOptions[1], date: '2024-01-22', status: 'Cancelled', total: 70 },
  { id: '#12353', customer: 'Ogulnur Aşyrowa', vendor: vendorOptions[0], date: '2024-01-23', status: 'Pending', total: 110 },
  { id: '#12354', customer: 'Täçmämmet Meredow', vendor: vendorOptions[2], date: '2024-01-24', status: 'Shipped', total: 160 },
];

export const OrdersPage: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = React.useState<Order[]>(initialOrders);
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | OrderStatus>('all');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openForm, setOpenForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Order | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchesQuery = [o.id, o.customer].some((v) => v.toLowerCase().includes(query.toLowerCase()));
    const matchesStatus = statusFilter === 'all' ? true : o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const paged = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const openAdd = () => { setEditing(null); setOpenForm(true); };
  const openEdit = (o: Order) => { setEditing(o); setOpenForm(true); };

  const handleSubmit = (data: Partial<Order>) => {
    if (editing) {
      setOrders((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...data } as Order : x)));
    } else {
      const newOrder: Order = {
        id: data.id || `#${String(Date.now()).slice(-5)}`,
        customer: String(data.customer || ''),
        vendor: String(data.vendor || vendorOptions[0]),
        date: String(data.date || new Date().toISOString().slice(0, 10)),
        status: (data.status as OrderStatus) || 'Pending',
        total: Number(data.total || 0),
      };
      setOrders((prev) => [newOrder, ...prev]);
    }
    setOpenForm(false);
  };

  const confirmDelete = () => {
    if (deleteId) setOrders((prev) => prev.filter((o) => o.id !== deleteId));
    setDeleteId(null);
  };

  const formatTMT = (v: number) => `TMT ${v.toFixed(2)}`;

  return (
    <>
      <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={12} md={6}><Typography variant="h5">{t('orders.title')}</Typography></Grid>
        <Grid item xs={12} md={3}>
          <TextField fullWidth placeholder={t('orders.search')} value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} size="small" InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} />
        </Grid>
        <Grid item xs={8} md={2}>
          <TextField select fullWidth size="small" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(0); }}>
            <MenuItem value="all">{t('orders.statusFilter')}</MenuItem>
            {(['Pending','Shipped','Delivered','Cancelled'] as OrderStatus[]).map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
          </TextField>
        </Grid>
        <Grid item xs={4} md="auto" textAlign="right">
          <Button startIcon={<AddIcon />} variant="contained" size="small" onClick={openAdd} sx={{ px: 2 }}>{t('orders.newOrder')}</Button>
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('orders.columns.orderId')}</TableCell>
                  <TableCell>{t('orders.columns.customerName')}</TableCell>
                  <TableCell>{t('orders.columns.vendor')}</TableCell>
                  <TableCell>{t('orders.columns.date')}</TableCell>
                  <TableCell>{t('orders.columns.status')}</TableCell>
                  <TableCell align="right">{t('orders.columns.total')}</TableCell>
                  <TableCell align="right">{t('orders.columns.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((o) => (
                  <TableRow key={o.id} hover sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>{o.vendor}</TableCell>
                    <TableCell>{o.date}</TableCell>
                    <TableCell><OrderStatusChip status={o.status} /></TableCell>
                    <TableCell align="right">{formatTMT(o.total)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" onClick={() => openEdit(o)}><EditOutlinedIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteId(o.id)}><DeleteOutlineIcon fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
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
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>

      <OrderFormDialog open={openForm} initial={editing} vendorOptions={vendorOptions} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
      <ConfirmDialog open={!!deleteId} title={t('orders.deletePrompt')} description={t('orders.deleteDescription')} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </>
  );
};
