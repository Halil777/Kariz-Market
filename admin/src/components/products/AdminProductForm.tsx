import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { fetchCategoryTree, type CategoryNode } from '@/api/categories'
import { useQuery } from '@tanstack/react-query'
import { absoluteAssetUrl } from '@/api/client'
import { uploadFile } from '@/api/upload'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'

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
  specs?: Array<{ titleTk?: string; titleRu?: string; textTk?: string; textRu?: string }>
}

type Props = {
  open: boolean
  initial?: Partial<AdminProductFormValue>
  onClose: () => void
  onSubmit: (payload: AdminProductFormValue) => void
}

export default function AdminProductForm({ open, initial, onClose, onSubmit }: Props) {
  const { t, i18n } = useTranslation()
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
  const [categoryPath, setCategoryPath] = useState<string[]>([])
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [specs, setSpecs] = useState<Array<{ titleTk?: string; titleRu?: string; textTk?: string; textRu?: string }>>([])
  const currentLang = useMemo(() => {
    const lang = i18n.resolvedLanguage || i18n.language || 'en'
    if (lang.startsWith('ru')) return 'ru'
    if (lang.startsWith('tk')) return 'tk'
    return 'en'
  }, [i18n.language, i18n.resolvedLanguage])
  const localizeCategoryName = useCallback((node: CategoryNode) => {
    if (currentLang === 'ru') return (node as any).nameRu || (node as any).nameTk || node.name
    if (currentLang === 'tk') return (node as any).nameTk || (node as any).nameRu || node.name
    return node.name || (node as any).nameRu || (node as any).nameTk
  }, [currentLang])

  useEffect(() => {
    setErrorKey(null)
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
      setSpecs((initial as any).specs || [])
      if (initial.categoryId && Array.isArray(tree)) {
        const chain = findChain(tree as CategoryNode[], String(initial.categoryId))
        setCategoryPath(chain)
      } else {
        setCategoryPath([])
      }
    } else {
      setStatus('active'); setSku(''); setNameTk(''); setNameRu(''); setUnit('count'); setPrice(0); setCompareAt(''); setDiscountPct(0); setStock(0); setImages([]); setCategoryPath([]); setSpecs([])
    }
  }, [initial, open, tree])

  // Dynamic multi-level category selection
  function findChain(nodes: CategoryNode[], targetId: string, acc: string[] = []): string[] {
    for (const n of nodes) {
      const next = [...acc, n.id]
      if (n.id === targetId) return next
      if (n.children?.length) {
        const sub = findChain(n.children, targetId, next)
        if (sub.length) return sub
      }
    }
    return []
  }

  const levels: CategoryNode[][] = useMemo(() => {
    const out: CategoryNode[][] = []
    let options = (tree as CategoryNode[]) || []
    out.push(options)
    for (let i = 0; i < categoryPath.length; i++) {
      const sel = categoryPath[i]
      const node = sel ? options.find((n) => n.id === sel) : undefined
      if (node?.children?.length) {
        options = node.children
        out.push(options)
      } else {
        break
      }
    }
    return out
  }, [tree, categoryPath])

  const onSelectLevel = (levelIndex: number, id: string) => {
    setCategoryPath((prev) => {
      if (!id) return prev.slice(0, levelIndex)
      const next = prev.slice(0, levelIndex)
      next[levelIndex] = id
      return next
    })
  }

  const getSelectedCategoryId = () => {
    for (let i = categoryPath.length - 1; i >= 0; i--) {
      if (categoryPath[i]) return categoryPath[i]
    }
    return undefined
  }

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
    setErrorKey(null)
    if (!nameTk && !nameRu) { setErrorKey('products.form.errors.nameRequired'); return }
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
      categoryId: getSelectedCategoryId(),
      status,
      specs,
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t(initial?.id ? 'products.form.editTitle' : 'products.form.addTitle')}</DialogTitle>
      <DialogContent>
        {errorKey && <Alert severity="error" sx={{ mb: 2 }}>{t(errorKey)}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}><TextField label={t('products.form.labels.nameTk')} value={nameTk} onChange={(e) => setNameTk(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField label={t('products.form.labels.nameRu')} value={nameRu} onChange={(e) => setNameRu(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField label={t('products.form.labels.sku')} value={sku} onChange={(e) => setSku(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField select label={t('products.form.labels.unit')} value={unit} onChange={(e) => setUnit(e.target.value as any)} fullWidth>
            <MenuItem value="count">{t('products.form.units.count')}</MenuItem>
            <MenuItem value="kg">{t('products.form.units.kg')}</MenuItem>
            <MenuItem value="l">{t('products.form.units.l')}</MenuItem>
          </TextField></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label={t('products.form.labels.price')} value={price} onChange={(e) => onChangePrice(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label={t('products.form.labels.compareAt')} value={compareAt} onChange={(e) => onChangeCompareAt(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} md={4}><TextField type="number" inputProps={{ step: '0.01' }} label={t('products.form.labels.discountPct')} value={discountPct} onChange={(e) => onChangeDiscount(e.target.value)} fullWidth /></Grid>
          {levels.map((opts, i) => (
            <Grid key={i} item xs={12} md={6}>
              <TextField select fullWidth label={i === 0 ? t('products.form.labels.category') : t('products.form.labels.subcategoryWithIndex', { index: i })}
                value={categoryPath[i] || ''}
                onChange={(e) => onSelectLevel(i, e.target.value)}
                disabled={!opts.length}
              >
                <MenuItem value="">{i === 0 ? t('products.form.options.none') : t('products.form.options.noneChild')}</MenuItem>
                {opts.map((n) => (
                  <MenuItem key={n.id} value={n.id}>{localizeCategoryName(n)}</MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}
          <Grid item xs={12} md={6}><TextField type="number" label={t('products.form.labels.stock')} value={stock} onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField select label={t('products.form.labels.status')} value={status} onChange={(e) => setStatus(e.target.value as any)} fullWidth>
            <MenuItem value="active">{t('products.status.active')}</MenuItem>
            <MenuItem value="inactive">{t('products.status.inactive')}</MenuItem>
          </TextField></Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">{t('products.form.upload.title')}</Typography>
              <Button sx={{ mt: 1 }} component="label" variant="outlined">{t('products.form.upload.choose')}
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
        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{t('products.form.characteristicsTitle')}</Typography>
            {specs.map((row, idx) => (
              <Grid container spacing={1} key={idx} sx={{ mb: 1 }}>
                <Grid item xs={12} md={3}><TextField fullWidth label={t('products.form.labels.titleTk')} value={row.titleTk || ''} onChange={(e) => setSpecs(prev => prev.map((r,i)=> i===idx ? { ...r, titleTk: e.target.value } : r))} /></Grid>
                <Grid item xs={12} md={3}><TextField fullWidth label={t('products.form.labels.titleRu')} value={row.titleRu || ''} onChange={(e) => setSpecs(prev => prev.map((r,i)=> i===idx ? { ...r, titleRu: e.target.value } : r))} /></Grid>
                <Grid item xs={12} md={5}><TextField fullWidth label={t('products.form.labels.textTk')} value={row.textTk || ''} onChange={(e) => setSpecs(prev => prev.map((r,i)=> i===idx ? { ...r, textTk: e.target.value } : r))} /></Grid>
                <Grid item xs={12} md={1}><Button color="error" onClick={() => setSpecs(prev => prev.filter((_,i)=>i!==idx))}>{t('products.form.buttons.remove')}</Button></Grid>
                <Grid item xs={12} md={6}><TextField fullWidth label={t('products.form.labels.textRu')} value={row.textRu || ''} onChange={(e) => setSpecs(prev => prev.map((r,i)=> i===idx ? { ...r, textRu: e.target.value } : r))} /></Grid>
              </Grid>
            ))}
            <Button variant="outlined" onClick={() => setSpecs(prev => [...prev, {}])}>{t('products.form.buttons.addCharacteristic')}</Button>
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">{t('products.form.buttons.cancel')}</Button>
        <Button onClick={submit} variant="contained">{t(initial?.id ? 'products.form.buttons.save' : 'products.form.buttons.add')}</Button>
      </DialogActions>
    </Dialog>
  )
}
