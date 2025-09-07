import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Switch, FormControlLabel, Avatar, Stack } from '@mui/material';
import { CategoryDto, CategoryNode } from '@/api/categories';
import { uploadFile } from '@/api/upload';
import { absoluteAssetUrl } from '@/api/client';

type Props = {
  open: boolean;
  initial?: CategoryDto | null;
  tree: CategoryNode[];
  onClose: () => void;
  onSubmit: (payload: Partial<CategoryDto>) => void;
};

const collectOptions = (nodes: CategoryNode[], depth = 0, list: { id: string; label: string }[] = []) => {
  for (const n of nodes) {
    list.push({ id: n.id, label: `${'— '.repeat(depth)}${(n as any).nameTk || n.name}` });
    if (n.children?.length) collectOptions(n.children, depth + 1, list);
  }
  return list;
};

export const CategoryFormDialog: React.FC<Props> = ({ open, initial, tree, onClose, onSubmit }) => {
  const [nameTk, setNameTk] = React.useState('');
  const [nameRu, setNameRu] = React.useState('');
  const [parentId, setParentId] = React.useState<string | ''>('');
  const [isActive, setIsActive] = React.useState(true);
  const [imageUrl, setImageUrl] = React.useState<string>('');

  useEffect(() => {
    if (initial) {
      setNameTk((initial as any).nameTk || initial.name || '');
      setNameRu((initial as any).nameRu || '');
      setParentId(initial.parentId || '');
      setIsActive(initial.isActive);
      setImageUrl((initial as any).imageUrl || '');
    } else {
      setNameTk(''); setNameRu(''); setParentId(''); setIsActive(true); setImageUrl('');
    }
  }, [initial, open]);

  const options = collectOptions(tree);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Name (TK)" value={nameTk} onChange={(e) => setNameTk(e.target.value)} required /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Name (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} required /></Grid>
          <Grid item xs={12}>
            <TextField select fullWidth label="Parent Category" value={parentId} onChange={(e) => setParentId(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {options.map((o) => (<MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar variant="rounded" src={absoluteAssetUrl(imageUrl) || undefined} sx={{ width: 56, height: 56 }} />
              <Button variant="contained" size="small" component="label">Upload Image
                <input type="file" hidden accept="image/*" onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const url = await uploadFile(f);
                    setImageUrl(url);
                  }
                }} />
              </Button>
              {imageUrl && (
                <Button size="small" color="inherit" onClick={() => setImageUrl('')}>Remove</Button>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSubmit({ id: initial?.id as any, name: nameTk, nameTk, nameRu, parentId: (parentId || null) as any, isActive, imageUrl: imageUrl || undefined })}>{initial ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

