import { useEffect, useMemo, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { absoluteAssetUrl, uploadFile } from '../../api/upload'
import { createProduct, getProduct, updateProduct, type ProductDto } from '../../api/products'
import { fetchCategoryTree, type CategoryNode } from '../../api/categories'
import DeleteIcon from '@mui/icons-material/Delete'

export default function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = !!id && id !== 'new'
  const qc = useQueryClient()
  const { data: initial } = useQuery({ queryKey: ['vendor','product', id], queryFn: () => getProduct(id!), enabled: editing })
  const { data: tree = [] } = useQuery({ queryKey: ['categories','tree'], queryFn: fetchCategoryTree })

  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [sku, setSku] = useState('')
  const [nameTk, setNameTk] = useState('')
  const [nameRu, setNameRu] = useState('')
  const [unit, setUnit] = useState<'kg'|'l'|'count'>('count')
  const [price, setPrice] = useState<number>(0)
  const [compareAt, setCompareAt] = useState<number | ''>('')
  const [discountPct, setDiscountPct] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [parentId, setParentId] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (initial) {
      setStatus((initial.status as any) || 'active')
      setSku(initial.sku)
      setNameTk((initial as any).nameTk || '')
      setNameRu((initial as any).nameRu || '')
      setUnit(initial.unit)
      setPrice(Number(initial.price) || 0)
      setCompareAt(initial.compareAt != null ? Number(initial.compareAt) : '')
      setDiscountPct(Number(initial.discountPct) || 0)
      setStock(initial.stock || 0)
      setImages(initial.images || [])
      setCategoryId(initial.categoryId || '')
    }
  }, [initial])

  useEffect(() => {
    if (!categoryId) { setParentId(''); return }
    // infer parentId from tree
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

  const mCreate = useMutation({ mutationFn: createProduct, onSuccess: (p) => { qc.invalidateQueries({ queryKey: ['vendor','products'] }); navigate(`/products/${p.id}`) }, onError: (e:any) => setError(String(e?.message || e)) })
  const mUpdate = useMutation({ mutationFn: (payload: any) => updateProduct(id!, payload), onSuccess: (p) => { qc.invalidateQueries({ queryKey: ['vendor','products'] }); navigate(`/products/${p.id}`) }, onError: (e:any) => setError(String(e?.message || e)) })

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

  const submit = () => {
    setError('')
    if (!nameTk && !nameRu) { setError('Name (TM) or Name (RU) required'); return }
    const payload: Partial<ProductDto> & any = {
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
    if (editing) mUpdate.mutate(payload)
    else mCreate.mutate(payload)
  }

  // Auto-calc relationships between price, compareAt, discountPct
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

  return (
    <>
      <BreadcrumbsNav />
      <Card>
        <CardHeader title={editing ? 'Edit Product' : 'Add Product'} />
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Name (TM)" value={nameTk} onChange={(e) => setNameTk(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Name (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Unit" value={unit} onChange={(e) => setUnit(e.target.value as any)}>
                    <MenuItem value="count">san</MenuItem>
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="l">litr</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Price" type="number" inputProps={{ min: 0, step: '0.01' }} value={price} onChange={(e) => onChangePrice(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Old Price" type="number" inputProps={{ min: 0, step: '0.01' }} value={compareAt} onChange={(e) => onChangeCompareAt(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField fullWidth label="Discount (%)" type="number" inputProps={{ min: 0, max: 100, step: '0.01' }} value={discountPct} onChange={(e) => onChangeDiscount(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Category" value={parentId} onChange={(e) => { setParentId(e.target.value); setCategoryId('') }}>
                    <MenuItem value="">—</MenuItem>
                    {parents.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{(p as any).nameTk || p.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Subcategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={!parentId}>
                    <MenuItem value="">—</MenuItem>
                    {children.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{(c as any).nameTk || c.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Stock" type="number" inputProps={{ min: 0 }} value={stock} onChange={(e) => setStock(parseInt(e.target.value || '0', 10))} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12 }}>
              <Box display="flex" gap={1}>
                <Button color="primary" onClick={submit}>{editing ? 'Save' : 'Create'}</Button>
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
