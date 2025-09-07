import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Coupon, createCoupon, listCoupons, updateCoupon } from '@/api/coupons';
import { CouponFormDialog } from '@/components/coupons/CouponFormDialog';
import { absoluteAssetUrl } from '@/api/client';

export const CouponsPage: React.FC = () => {
  const qc = useQueryClient();
  const { data: coupons = [] } = useQuery({ queryKey: ['coupons'], queryFn: listCoupons });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Coupon | null>(null);

  const mCreate = useMutation({ mutationFn: createCoupon, onSuccess: () => { qc.invalidateQueries({ queryKey: ['coupons'] }); } });
  const mUpdate = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<Coupon> }) => updateCoupon(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['coupons'] }); } });

  const openAdd = () => { setEditing(null); setOpen(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setOpen(true); };
  const handleSubmit = (payload: Partial<Coupon>) => {
    const { id, ...rest } = payload as any;
    const clean: any = { ...rest };
    if (clean.startsAt == null || clean.startsAt === '') delete clean.startsAt;
    if (clean.endsAt == null || clean.endsAt === '') delete clean.endsAt;
    if (editing && id) mUpdate.mutate({ id, payload: clean });
    else mCreate.mutate(clean);
    setOpen(false);
  };

  const paged = coupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="h5">Coupons</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openAdd}>Add Coupon</Button>
      </Box>
      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name (TM)</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Discount %</TableCell>
                  <TableCell>Expiration Date</TableCell>
                  <TableCell>Usage Count</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((c) => (
                  <TableRow key={c.id} hover sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar variant="rounded" src={absoluteAssetUrl(c.imageUrl) || undefined} sx={{ width: 32, height: 32 }} />
                        <span>{c.nameTk || '-'}</span>
                      </Stack>
                    </TableCell>
                    <TableCell><strong>{c.code}</strong></TableCell>
                    <TableCell>{c.type === 'percent' ? `${c.value}%` : c.value}</TableCell>
                    <TableCell>{c.endsAt || '-'}</TableCell>
                    <TableCell>{c.usageCount}</TableCell>
                    <TableCell>{c.isActive ? <Chip size="small" color="success" variant="outlined" label="Active" /> : <Chip size="small" color="error" variant="outlined" label="Inactive" />}</TableCell>
                    <TableCell align="right"><IconButton size="small" onClick={() => openEdit(c)}><EditOutlinedIcon fontSize="small" /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination component="div" count={coupons.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} />
        </CardContent>
      </Card>

      <CouponFormDialog open={open} initial={editing || undefined} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

