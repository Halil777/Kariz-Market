import { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField, MenuItem } from '@mui/material'
import type { CategoryDto, CategoryNode } from '../../api/categories'

type Props = {
  open: boolean
  initial?: CategoryDto
  tree: CategoryNode[]
  onClose: () => void
  onSubmit: (payload: Partial<CategoryDto>) => void
}

function collectOptions(nodes: CategoryNode[], depth = 0, list: { id: string; label: string }[] = []) {
  for (const n of nodes) {
    list.push({ id: n.id, label: `${'— '.repeat(depth)}${n.name}` })
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
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<string | ''>('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setParentId(initial.parentId || '')
      setIsActive(initial.isActive)
    } else {
      setName('')
      setParentId('')
      setIsActive(true)
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
    onSubmit({ name, parentId: parentId || null, isActive })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
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
