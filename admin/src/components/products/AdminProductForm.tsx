import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { fetchCategoryTree, type CategoryNode } from '@/api/categories'
import { useQuery } from '@tanstack/react-query'
import { absoluteAssetUrl } from '@/api/client'
import { uploadFile } from '@/api/upload'
import DeleteIcon from '@mui/icons-material/Delete'

export type AdminProductFormValue = {
  id?: string
  nameTk?: string
  nameRu?: string
  sku?: string
  unit: 'kg'|'l'|'count'
  price: number
  compareAt?: number | ''
  discountPct?: number
  stock: number
  images: string[]
  categoryId?: string | ''
  status: 'active' | 'inactive'
}

type Props = {
  open: boolean
  initial?: Partial<AdminProductFormValue>
  onClose: () => void
  onSubmit: (payload: AdminProductFormValue) => void
}

export default function AdminProductForm({ open, initial, onClose, onSubmit }: Props) {
  const { data: tree = [] } = useQuery({ queryKey: ['admin','categories','tree'], queryFn: fetchCategoryTree })
  const [status, setStatus] = useState<'active'|'inactive'>('active')
  const [sku, setSku] = useState('')
  const [nameTk, setNameTk] = useState('')
  const [nameRu, setNameRu] = useState('')
  const [unit, setUnit] = useState<'kg'|'l'|'count'>('count')
  const [price, setPrice] = useState<number>(0)
  const [compareAt, setCompareAt] = useState<number | ''>('')
  const [discountPct, setDiscountPct] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  const [parentId, setParentId] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (initial) {
      setStatus((initial.status as any) || 'active')
      setSku((initial.sku as any) || '')
      setNameTk((initial.nameTk as any) || '')
      setNameRu((initial.nameRu as any) || '')
      setUnit((initial.unit as any) || 'count')
      setPrice(initial.price != null ? Number(initial.price) : 0)
      setCompareAt((initial.compareAt as any) ?? '')
      setDiscountPct(initial.discountPct != null ? Number(initial.discountPct) : 0)
      setStock(initial.stock != null ? Number(initial.stock) : 0)
      setImages((initial.images as any) || [])
      setCategoryId((initial.categoryId as any) || '')
    } else {
      setStatus('active'); setSku(''); setNameTk(''); setNameRu(''); setUnit('count'); setPrice(0); setCompareAt(''); setDiscountPct(0); setStock(0); setImages([]); setCategoryId(''); setParentId('');
    }
  }, [initial, open])

  useEffect(() => {
    if (!categoryId) { setParentId(''); return }
    const find = (nodes: CategoryNode[], pid?: string): string | null => {
      for (const n of nodes) {
        if (n.id === categoryId) return pid || null
        const c = n.children && find(n.children, n.id)
        if (c !== null && c !== undefined) return c
      }
      return null
    }
    const p = find(tree as CategoryNode[])
    setParentId(p || '')
  }, [categoryId, tree])

  const parents = useMemo(() => (tree as CategoryNode[]), [tree])
  const children = useMemo(() => {
    if (!parentId) return [] as CategoryNode[]
    const find = (nodes: CategoryNode[], id: string): CategoryNode | undefined => {
      for (const n of nodes) {
        if (n.id === id) return n
        const f = n.children && find(n.children, id)
        if (f) return f
      }
    }
    const parent = find(tree as CategoryNode[], parentId)
    return parent?.children || []
  }, [parentId, tree])

  const onPickImages = async (files: FileList | null) => {
    if (!files) return
    const urls: string[] = []
    for (const f of Array.from(files)) {
      const url = await uploadFile(f)
      urls.push(url)
    }
    setImages((prev) => [...prev, ...urls])
  }
  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url))

  const onChangeCompareAt = (val: string) => {
    const v = val === '' ? '' : parseFloat(val)
    setCompareAt(v as any)
    if (v !== '' && !Number.isNaN(v) && discountPct > 0) {
      const newPrice = Number((Number(v) * (1 - discountPct / 100)).toFixed(2))
      setPrice(newPrice)
    }
  }
  const onChangeDiscount = (val: string) => {
    const d = Math.max(0, Math.min(100, parseFloat(val || '0')))
    setDiscountPct(d)
    if (compareAt !== '' && Number(compareAt) > 0) {
      const newPrice = Number((Number(compareAt) * (1 - d / 100)).toFixed(2))
      setPrice(newPrice)
    }
  }
  const onChangePrice = (val: string) => {
    const p = parseFloat(val || '0')
    setPrice(p)
    if (compareAt !== '' && Number(compareAt) > 0) {
      const d = Number((100 * (1 - p / Number(compareAt))).toFixed(2))
      setDiscountPct(Math.max(0, Math.min(100, d)))
    }
  }

  const submit = () => {
    setError('')
    if (!nameTk && !nameRu) { setError('Name (TM) or Name (RU) required'); return }
    const payload: AdminProductFormValue = {
      id: (initial as any)?.id,
      sku: sku || undefined,
      nameTk: nameTk || undefined,
      nameRu: nameRu || undefined,
      unit,
      price,
      compareAt: compareAt === '' ? undefined : compareAt,
      discountPct,
      stock,
      images,
      categoryId: categoryId || undefined,
      status,
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initial?.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}><TextField label="Name (TM)" value={nameTk} onChange={(e) => setNameTk(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField label="Name (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as any)} fullWidth>
            <MenuItem value="count">san</MenuItem>
            <MenuItem value="kg">kg</MenuItem>
            <MenuItem value="l">litr</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label="Price" value={price} onChange={(e) => onChangePrice(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label="Old Price" value={compareAt} onChange={(e) => onChangeCompareAt(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label="Discount (%)" value={discountPct} onChange={(e) => onChangeDiscount(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField select label="Category" value={parentId} onChange={(e) => { setParentId(e.target.value); setCategoryId('') }} fullWidth>
            <MenuItem value="">—</MenuItem>
            {parents.map((p) => (<MenuItem key={p.id} value={p.id}>{(p as any).nameTk || p.name}</MenuItem>))}
          </TextField></Grid>
          <Grid item xs={12} md={6}><TextField select label="Subcategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} fullWidth disabled={!parentId}>
            <MenuItem value="">—</MenuItem>
            {children.map((c) => (<MenuItem key={c.id} value={c.id}>{(c as any).nameTk || c.name}</MenuItem>))}
          </TextField></Grid>
          <Grid item xs={12} md={6}><TextField type="number" label="Stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)} fullWidth>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField></Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Upload Images</Typography>
              <Button sx={{ mt: 1 }} component="label" variant="outlined">Choose Files
                <input hidden type="file" multiple accept="image/*" onChange={(e) => onPickImages(e.target.files)} />
              </Button>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {images.map((u) => (
                  <Stack key={u} direction="row" alignItems="center" spacing={0.5} sx={{ mr: 1, mb: 1 }}>
                    <Avatar variant="rounded" src={absoluteAssetUrl(u)} sx={{ width: 56, height: 56 }} />
                    <IconButton size="small" color="error" onClick={() => removeImage(u)}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={submit} variant="contained">{initial?.id ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  )
}
