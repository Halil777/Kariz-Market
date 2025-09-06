import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Switch, FormControlLabel, Stack, Avatar } from '@mui/material';
import { Coupon } from '@/api/coupons';
import { uploadFile } from '@/api/upload';
import { absoluteAssetUrl } from '@/api/client';

type Props = {
  open: boolean;
  initial?: Coupon | null;
  onClose: () => void;
  onSubmit: (payload: Partial<Coupon>) => void;
};

export const CouponFormDialog: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const [code, setCode] = React.useState('');
  const [type, setType] = React.useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = React.useState<number>(10);
  const [startsAt, setStartsAt] = React.useState<string>('');
  const [endsAt, setEndsAt] = React.useState<string>('');
  const [isActive, setIsActive] = React.useState(true);
  const [nameTk, setNameTk] = React.useState('');
  const [nameRu, setNameRu] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState<string>('');

  useEffect(() => {
    if (initial) {
      setCode(initial.code);
      setType(initial.type);
      setValue(Number(initial.value));
      setStartsAt(initial.startsAt || '');
      setEndsAt(initial.endsAt || '');
      setIsActive(initial.isActive);
      setNameTk(initial.nameTk || '');
      setNameRu(initial.nameRu || '');
      setImageUrl(initial.imageUrl || '');
    } else {
      setCode(''); setType('percent'); setValue(10); setStartsAt(''); setEndsAt(''); setIsActive(true); setNameTk(''); setNameRu(''); setImageUrl('');
    }
  }, [initial, open]);

  const submit = () => onSubmit({ id: initial?.id, code, type, value, startsAt: startsAt || null, endsAt: endsAt || null, isActive, nameTk, nameRu, imageUrl });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initial ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}><TextField label="Code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} fullWidth required /></Grid>
          <Grid item xs={12} sm={3}><TextField select label="Type" value={type} onChange={(e) => setType(e.target.value as any)} fullWidth>
            <MenuItem value="percent">Percent</MenuItem>
            <MenuItem value="fixed">Fixed</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} sm={3}><TextField type="number" label="Value" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} fullWidth /></Grid>
          <Grid item xs={12} sm={6}><TextField type="date" label="Start Date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><TextField type="date" label="Expiration Date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Name (TK)" value={nameTk} onChange={(e) => setNameTk(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} sm={6}><TextField label="Name (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12}><FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" /></Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar variant="rounded" src={absoluteAssetUrl(imageUrl) || undefined} sx={{ width: 56, height: 56 }} />
              <Button variant="contained" size="small" component="label">Upload Image
                <input type="file" hidden accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f); setImageUrl(url); } }} />
              </Button>
              {imageUrl && <Button size="small" color="inherit" onClick={() => setImageUrl('')}>Remove</Button>}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>{initial ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

