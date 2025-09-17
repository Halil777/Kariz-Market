import { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField, MenuItem, Stack, Avatar, LinearProgress } from '@mui/material'
import type { CategoryDto, CategoryNode } from '../../api/categories'
import { uploadFile, absoluteAssetUrl } from '../../api/upload'

type Props = {
  open: boolean
  initial?: CategoryDto
  tree: CategoryNode[]
  onClose: () => void
  onSubmit: (payload: Partial<CategoryDto>) => void
}

function collectOptions(nodes: CategoryNode[], depth = 0, list: { id: string; label: string }[] = []) {
  for (const n of nodes) {
    const label = (n as any).nameTk || (n as any).name || ''
    list.push({ id: n.id, label: `${'— '.repeat(depth)}${label}` })
    if (n.children?.length) collectOptions(n.children, depth + 1, list)
  }
  return list
}

function findNode(nodes: CategoryNode[], id: string): CategoryNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n
    const inChild = n.children && findNode(n.children, id)
    if (inChild) return inChild
  }
}

function collectDescendants(node?: CategoryNode, set = new Set<string>()) {
  if (!node?.children) return set
  for (const c of node.children) {
    set.add(c.id)
    collectDescendants(c, set)
  }
  return set
}

export default function CategoryFormDialog({ open, initial, tree, onClose, onSubmit }: Props) {
  const [nameTk, setNameTk] = useState('')
  const [nameRu, setNameRu] = useState('')
  const [parentId, setParentId] = useState<string | ''>('')
  const [isActive, setIsActive] = useState(true)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (initial) {
      setNameTk((initial as any).nameTk || '')
      setNameRu((initial as any).nameRu || '')
      setParentId(initial.parentId || '')
      setIsActive(initial.isActive)
      setImageUrl(initial.imageUrl || '')
    } else {
      setNameTk('')
      setNameRu('')
      setParentId('')
      setIsActive(true)
      setImageUrl('')
    }
  }, [initial, open])

  const options = useMemo(() => {
    const all = collectOptions(tree)
    if (!initial) return all
    const current = findNode(tree, initial.id)
    const excluded = collectDescendants(current)
    excluded.add(initial.id)
    return all.filter((o) => !excluded.has(o.id))
  }, [tree, initial])

  const submit = () => {
    const payload: any = {
      nameTk: nameTk || undefined,
      nameRu: nameRu || undefined,
      parentId: parentId || null,
      isActive,
      imageUrl: imageUrl || undefined,
    }
    // if name is empty but translations provided, backend falls back to nameTk/nameRu
    onSubmit(payload)
  }

  const onPickImage = async (file?: File | null) => {
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadFile(file)
      setImageUrl(url)
    } catch (e) {
      console.error(e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar variant="rounded" src={absoluteAssetUrl(imageUrl) || undefined} sx={{ width: 48, height: 48 }} />
          <Button component="label" variant="outlined" size="small">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0] || null)} />
          </Button>
          {uploading && <LinearProgress sx={{ flex: 1, height: 6, borderRadius: 1 }} />}
        </Stack>
        <TextField label="Name (TM)" value={nameTk} onChange={(e) => setNameTk(e.target.value)} fullWidth />
        <TextField label="Name (RU)" value={nameRu} onChange={(e) => setNameRu(e.target.value)} fullWidth />
        <TextField select fullWidth label="Parent Category" value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          {options.map((o) => (
            <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>
          ))}
        </TextField>
        <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label={isActive ? 'Active' : 'Inactive'} />
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button onClick={submit}>{initial ? 'Save' : 'Create'}</Button>
      </DialogActions>
    </Dialog>
  )
}
