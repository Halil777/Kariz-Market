import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControlLabel, Switch, Box, Typography
} from '@mui/material';
import { uploadFile } from '@/api/upload';
import { absoluteAssetUrl } from '@/api/client';
import type { BannerDto } from '@/api/banners';
import { RichTextEditor } from '@/components/common/RichTextEditor';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BannerDto) => Promise<void> | void;
  initial?: BannerDto | null;
};

export const BannerFormDialog: React.FC<Props> = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = React.useState<BannerDto>(initial || { imageUrl: '', order: 0, isActive: true });
  React.useEffect(() => setForm(initial || { imageUrl: '', order: 0, isActive: true }), [initial]);

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file);
    setForm((f) => ({ ...f, imageUrl: url }));
  };

  const submit = async () => {
    await onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initial?.id ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" component="label">
                Upload Image
                <input hidden type="file" accept="image/*" onChange={pickImage} />
              </Button>
              {form.imageUrl && (
                <Box sx={{ width: 180, height: 100, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'grey.100', backgroundImage: `url(${absoluteAssetUrl(form.imageUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
            </Box>
            {!form.imageUrl && <Typography variant="caption" color="text.secondary">Image is required</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Title (Tm)" fullWidth value={form.titleTm || ''} onChange={(e) => setForm({ ...form, titleTm: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Title (Ru)" fullWidth value={form.titleRu || ''} onChange={(e) => setForm({ ...form, titleRu: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Subtitle (Tm)</Typography>
            <RichTextEditor value={form.subtitleTm || ''} onChange={(v) => setForm({ ...form, subtitleTm: v })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Subtitle (Ru)</Typography>
            <RichTextEditor value={form.subtitleRu || ''} onChange={(v) => setForm({ ...form, subtitleRu: v })} />
          </Grid>
          <Grid item xs={6}>
            <TextField type="number" label="Order" fullWidth value={form.order ?? 0} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value || '0', 10) })} />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel control={<Switch checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />} label="Active" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} disabled={!form.imageUrl} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BannerFormDialog;
