import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Chip, Stack, Divider, TableContainer, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import type { CategoryDto, CategoryNode } from '../../api/categories'
import { createCategory, deleteCategory, fetchCategories, fetchCategoryTree, updateCategory } from '../../api/categories'
import CategoryFormDialog from '../../components/categories/CategoryFormDialog'

function flatten(nodes: CategoryNode[], depth = 0): (CategoryDto & { depth: number })[] {
  const out: (CategoryDto & { depth: number })[] = []
  for (const { children, ...rest } of nodes) {
    out.push({ ...(rest as CategoryDto), depth })
    if (children?.length) out.push(...flatten(children, depth + 1))
  }
  return out
}

export default function Categories() {
  const qc = useQueryClient()
  const { data: tree = [] } = useQuery({ queryKey: ['categories', 'tree'], queryFn: fetchCategoryTree })
  const { data: flat = [] } = useQuery({ queryKey: ['categories', 'flat'], queryFn: fetchCategories })
  const rows = flatten(tree as CategoryNode[])

  const [openForm, setOpenForm] = React.useState(false)
  const [editing, setEditing] = React.useState<CategoryDto | null>(null)

  const mCreate = useMutation({ mutationFn: createCategory, onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }) } })
  const mUpdate = useMutation({ mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryDto> }) => updateCategory(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }) } })
  const mDelete = useMutation({ mutationFn: deleteCategory, onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }) } })

  const openAdd = () => { setEditing(null); setOpenForm(true) }
  const openEdit = (row: CategoryDto) => { setEditing(row); setOpenForm(true) }

  const handleSubmit = (payload: Partial<CategoryDto>) => {
    if (editing) mUpdate.mutate({ id: editing.id, payload })
    else mCreate.mutate(payload)
    setOpenForm(false)
  }

  return (
    <>
      <BreadcrumbsNav />
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Categories" action={<Button startIcon={<AddIcon />} onClick={openAdd}>Add Category</Button>} />
        <CardContent sx={{ p: 0 }}>
          <Divider />
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Parent Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => {
                  const parentName = flat.find((c) => c.id === r.parentId)?.name || '—'
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ pl: 2 + r.depth * 2 }}>{r.name}</TableCell>
                      <TableCell>{parentName}</TableCell>
                      <TableCell>
                        <Chip size="small" label={r.isActive ? 'active' : 'inactive'} color={r.isActive ? 'success' : 'default'} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton onClick={() => openEdit(r)}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => mDelete.mutate(r.id)}><DeleteIcon /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <CategoryFormDialog open={openForm} initial={editing || undefined} tree={(tree as CategoryNode[]) || []} onClose={() => setOpenForm(false)} onSubmit={handleSubmit} />
    </>
  )
}
