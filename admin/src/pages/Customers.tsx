import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { Customer, listCustomers, updateCustomer } from '@/api/customers';
import { CustomerFormDialog } from '@/components/customers/CustomerFormDialog';

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

  const openEdit = (c: Customer) => { setEditing(c); setOpen(true); };
  const handleSubmit = ({ id, changes }: { id: string; changes: Partial<Customer> }) => {
    mUpdate.mutate({ id, changes });
    setOpen(false);
  };

  const paged = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="h5">Customers</Typography>
        <TextField
          size="small"
          placeholder="Search by email or phone"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>) }}
          sx={{ width: 320 }}
        />
      </Box>
      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((c) => (
                  <TableRow key={c.id} hover sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.25}>
                        <Avatar sx={{ width: 28, height: 28 }}>{(c.email || '?').charAt(0).toUpperCase()}</Avatar>
                        <Box>
                          <Box component="div" sx={{ fontWeight: 600 }}>{c.email}</Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{c.phone || '-'}</TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{c.isActive ? <Chip size="small" color="success" variant="outlined" label="Active" /> : <Chip size="small" color="error" variant="outlined" label="Inactive" />}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit"><span><IconButton size="small" onClick={() => openEdit(c)} disabled={isFetching}><EditOutlinedIcon fontSize="small" /></IconButton></span></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>{isFetching ? 'Loading...' : 'No customers found'}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={customers.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} />
        </CardContent>
      </Card>

      <CustomerFormDialog open={open} initial={editing} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

