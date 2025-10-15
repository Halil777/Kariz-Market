import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Customer, listCustomers, updateCustomer } from '@/api/customers';
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog';

const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'TMT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} TMT`;
  }
};

const formatDate = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

const formatDateTime = (value: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

const initialsFor = (customer: Customer) => {
  if (customer.displayName) {
    const letters = customer.displayName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    if (letters) return letters;
  }
  return (customer.email || '?').charAt(0).toUpperCase();
};

export const CustomersPage: React.FC = () => {
  const qc = useQueryClient();
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Customer | null>(null);

  const { data: customers = [], isFetching } = useQuery({
    queryKey: ['customers', query],
    queryFn: () => listCustomers(query || undefined),
  });

  const mUpdate = useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<Customer> }) => updateCustomer(id, changes),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); },
  });

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setOpen(true);
  };

  const handleSubmit = ({ id, changes }: { id: string; changes: Partial<Customer> }) => {
    mUpdate.mutate({ id, changes });
    setOpen(false);
  };

  const paged = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const metrics = React.useMemo(() => {
    let active = 0;
    let withOrders = 0;
    let totalLoyalty = 0;
    for (const customer of customers) {
      if (customer.isActive) active += 1;
      if (customer.orderCount > 0) withOrders += 1;
      totalLoyalty += customer.loyaltyPoints;
    }
    return {
      total: customers.length,
      active,
      withOrders,
      totalLoyalty,
    };
  }, [customers]);

  return (
    <>
      <Box
        display="flex"
        alignItems={{ xs: 'stretch', md: 'center' }}
        flexWrap="wrap"
        gap={1.5}
        sx={{ mb: 2 }}
      >
        <Box flex={1} minWidth={220}>
          <Typography variant="h5">Customers</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor registered customers, loyalty balances and purchasing activity.
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search by name, email or phone"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280 }}
        />
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <MetricCard label="Total customers" value={metrics.total.toString()} />
        <MetricCard label="Active" value={metrics.active.toString()} />
        <MetricCard label="Placed orders" value={metrics.withOrders.toString()} />
        <MetricCard
          label="Loyalty points"
          value={metrics.totalLoyalty.toString()}
          helper={metrics.totalLoyalty > 0 ? `${metrics.totalLoyalty} pts` : undefined}
        />
      </Stack>

      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="right">Orders</TableCell>
                  <TableCell align="right">Total spent</TableCell>
                  <TableCell align="right">Loyalty</TableCell>
                  <TableCell>Last order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((customer) => (
                  <TableRow key={customer.id} hover sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.25}>
                        <Avatar sx={{ width: 32, height: 32 }}>{initialsFor(customer)}</Avatar>
                        <Box>
                          <Typography component="div" sx={{ fontWeight: 600 }}>
                            {customer.displayName || '—'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2">{customer.phone || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Joined {formatDate(customer.createdAt)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{customer.orderCount}</TableCell>
                    <TableCell align="right">{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell align="right">{customer.loyaltyPoints}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDateTime(customer.lastOrderAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      {customer.isActive ? (
                        <Chip size="small" color="success" variant="outlined" label="Active" />
                      ) : (
                        <Chip size="small" color="error" variant="outlined" label="Inactive" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <span>
                          <IconButton size="small" onClick={() => openEdit(customer)} disabled={isFetching}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      {isFetching ? 'Loading...' : 'No customers found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={customers.length}
            page={page}
            onPageChange={(_, next) => setPage(next)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </CardContent>
      </Card>

      <CustomerFormDialog open={open} initial={editing} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

const MetricCard: React.FC<{ label: string; value: string; helper?: string }> = ({ label, value, helper }) => (
  <Card variant="outlined" sx={{ flex: 1, minWidth: 180 }}>
    <CardContent sx={{ py: 1.75 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h5">{value}</Typography>
      {helper && (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      )}
    </CardContent>
  </Card>
);
