import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, MenuItem } from '@mui/material';
import { VendorStatus } from './VendorStatusChip';
import { useTranslation } from 'react-i18next';

export type Vendor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: VendorStatus;
  createdAt: string; // ISO date
};

type Props = {
  open: boolean;
  initial?: Vendor | null;
  onClose: () => void;
  onSubmit: (data: Omit<Vendor, 'id' | 'createdAt'> & Partial<Pick<Vendor, 'id' | 'createdAt'>>) => void;
};

export const VendorFormDialog: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [status, setStatus] = React.useState<VendorStatus>('active');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setEmail(initial.email);
      setPhone(initial.phone);
      setStatus(initial.status);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setStatus('active');
    }
  }, [initial, open]);

  const handleSubmit = () => {
    if (!name || !email) return;
    onSubmit({ id: initial?.id, name, email, phone, status, createdAt: initial?.createdAt });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? t('vendors.editVendor') : t('vendors.addVendor')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label={t('vendors.vendorName')} value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
          <TextField type="email" label={t('vendors.email')} value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
          <TextField label={t('vendors.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
          <TextField select label={t('vendors.status')} value={status} onChange={(e) => setStatus(e.target.value as VendorStatus)} fullWidth>
            <MenuItem value="active">{t('vendors.active')}</MenuItem>
            <MenuItem value="suspended">{t('vendors.suspended')}</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initial ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};
