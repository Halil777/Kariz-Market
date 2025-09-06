import React, { useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, MenuItem } from '@mui/material';
import { OrderStatus } from './OrderStatusChip';

export type Order = {
  id: string; // e.g., #12345
  customer: string;
  vendor: string;
  date: string; // YYYY-MM-DD
  status: OrderStatus;
  total: number; // in TMT
};

type Props = {
  open: boolean;
  initial?: Order | null;
  vendorOptions: string[];
  onClose: () => void;
  onSubmit: (data: Partial<Order>) => void;
};

export const OrderFormDialog: React.FC<Props> = ({ open, initial, vendorOptions, onClose, onSubmit }) => {
  const [id, setId] = React.useState('');
  const [customer, setCustomer] = React.useState('');
  const [vendor, setVendor] = React.useState('');
  const [date, setDate] = React.useState('');
  const [status, setStatus] = React.useState<OrderStatus>('Pending');
  const [total, setTotal] = React.useState<number>(0);

  useEffect(() => {
    if (initial) {
      setId(initial.id.replace('#',''));
      setCustomer(initial.customer);
      setVendor(initial.vendor);
      setDate(initial.date);
      setStatus(initial.status);
      setTotal(initial.total);
    } else {
      setId(''); setCustomer(''); setVendor(''); setDate(''); setStatus('Pending'); setTotal(0);
    }
  }, [initial, open]);

  const handleSubmit = () => {
    const payload: Partial<Order> = {
      id: id ? `#${id}` : initial?.id,
      customer, vendor, date, status, total,
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initial ? 'Edit Order' : 'New Order'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}><TextField label="Order ID" value={id} onChange={(e) => setId(e.target.value)} fullWidth required placeholder="12345" /></Grid>
          <Grid item xs={12} md={8}><TextField label="Customer Name" value={customer} onChange={(e) => setCustomer(e.target.value)} fullWidth required /></Grid>
          <Grid item xs={12} md={6}><TextField select label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} fullWidth required>
            {vendorOptions.map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>))}
          </TextField></Grid>
          <Grid item xs={12} md={3}><TextField type="date" label="Date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} required /></Grid>
          <Grid item xs={12} md={3}><TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} fullWidth>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label="Total (TMT)" value={total} onChange={(e) => setTotal(parseFloat(e.target.value))} fullWidth /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>{initial ? 'Save' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};

