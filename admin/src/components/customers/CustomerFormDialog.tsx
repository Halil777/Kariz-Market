import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, Switch, FormControlLabel } from '@mui/material';
import { Customer } from '@/api/customers';

type Props = {
  open: boolean;
  initial: Customer | null;
  onClose: () => void;
  onSubmit: (payload: { id: string; changes: Partial<Customer> }) => void;
};

export const CustomerFormDialog: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);

  useEffect(() => {
    if (initial) {
      setEmail(initial.email);
      setPhone(initial.phone || '');
      setIsActive(initial.isActive);
    } else {
      setEmail(''); setPhone(''); setIsActive(true);
    }
  }, [initial, open]);

  const submit = () => {
    if (!initial) return;
    const changes: Partial<Customer> = { phone: phone || null, isActive };
    onSubmit({ id: initial.id, changes });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Customer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}><TextField label="Email" value={email} fullWidth disabled /></Grid>
          <Grid item xs={12}><TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12}><FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!initial}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

