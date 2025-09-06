import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem } from '@mui/material';
import { ProductStatus } from './ProductStatusChip';

export type Product = {
  id: string;
  image?: string;
  name: string;
  sku: string;
  vendor: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
};

type Props = {
  open: boolean;
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (data: Partial<Product>) => void;
};

export const ProductFormDialog: React.FC<Props> = ({ open, initial, onClose, onSubmit }) => {
  const [name, setName] = React.useState('');
  const [sku, setSku] = React.useState('');
  const [vendor, setVendor] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [price, setPrice] = React.useState<number>(0);
  const [stock, setStock] = React.useState<number>(0);
  const [status, setStatus] = React.useState<ProductStatus>('active');
  const [image, setImage] = React.useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setSku(initial.sku);
      setVendor(initial.vendor);
      setCategory(initial.category);
      setPrice(initial.price);
      setStock(initial.stock);
      setStatus(initial.status);
      setImage(initial.image || '');
    } else {
      setName('');
      setSku('');
      setVendor('');
      setCategory('');
      setPrice(0);
      setStock(0);
      setStatus('active');
      setImage('');
    }
  }, [initial, open]);

  const handleSubmit = () => {
    onSubmit({ id: initial?.id, name, sku, vendor, category, price, stock, status, image });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initial ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}><TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required /></Grid>
          <Grid item xs={12} md={6}><TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} fullWidth required /></Grid>
          <Grid item xs={12} md={6}><TextField label="Vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} fullWidth required /></Grid>
          <Grid item xs={12} md={6}><TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth required /></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label="Price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} fullWidth /></Grid>
          <Grid item xs={12} md={4}><TextField type="number" label="Stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)} fullWidth /></Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} fullWidth>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}><TextField label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} fullWidth /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initial ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

