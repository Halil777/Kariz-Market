import React from 'react';
import { Box, Button, Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { absoluteAssetUrl } from '@/api/client';
import { BannerDto, createBanner, deleteBanner, listBanners, updateBanner } from '@/api/banners';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { BannerFormDialog } from '@/components/banners/BannerFormDialog';

export const BannersPage: React.FC = () => {
  const [items, setItems] = React.useState<BannerDto[]>([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BannerDto | null>(null);

  const load = async () => setItems(await listBanners());
  React.useEffect(() => { load(); }, []);

  const clean = (v?: string | null) => (v && String(v).trim().length ? v : undefined);
  const toPayload = (b: BannerDto) => ({
    imageUrl: b.imageUrl,
    titleTm: clean(b.titleTm),
    titleRu: clean(b.titleRu),
    subtitleTm: clean(b.subtitleTm),
    subtitleRu: clean(b.subtitleRu),
    order: typeof b.order === 'number' ? b.order : undefined,
    isActive: b.isActive,
  });

  const onCreate = async (data: BannerDto) => { await createBanner(toPayload(data)); await load(); };
  const onUpdate = async (data: BannerDto) => { if (!editing?.id) return; await updateBanner(editing.id, toPayload(data)); await load(); };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Banners</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(null); setOpen(true); }}>New Banner</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Title (Tm)</TableCell>
              <TableCell>Title (Ru)</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((b) => (
              <TableRow key={b.id} hover>
                <TableCell>
                  <Box sx={{ width: 160, height: 70, borderRadius: 1, bgcolor: 'grey.100', backgroundImage: `url(${absoluteAssetUrl(b.imageUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                </TableCell>
                <TableCell>{b.titleTm}</TableCell>
                <TableCell>{b.titleRu}</TableCell>
                <TableCell>{b.order ?? 0}</TableCell>
                <TableCell>{b.isActive ? <Chip size="small" color="success" label="Active" /> : <Chip size="small" label="Inactive" />}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => { setEditing(b); setOpen(true); }} size="small"><EditIcon fontSize="small" /></IconButton>
                  <IconButton onClick={async () => { if (b.id) { await deleteBanner(b.id); await load(); } }} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BannerFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={editing ? onUpdate : onCreate}
        initial={editing}
      />
    </Box>
  );
};

export default BannersPage;
