// React import removed (not used)
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, Table, TableHead, TableRow, TableCell, TableBody, Chip, Divider, TableContainer, Paper } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'
import type { CategoryDto, CategoryNode } from '../../api/categories'
import { fetchCategories, fetchCategoryTree } from '../../api/categories'

function flatten(nodes: CategoryNode[], depth = 0): (CategoryDto & { depth: number })[] {
  const out: (CategoryDto & { depth: number })[] = []
  for (const { children, ...rest } of nodes) {
    out.push({ ...(rest as CategoryDto), depth })
    if (children?.length) out.push(...flatten(children, depth + 1))
  }
  return out
}

export default function Categories() {
  const { data: tree = [] } = useQuery({ queryKey: ['categories', 'tree'], queryFn: fetchCategoryTree })
  const { data: flat = [] } = useQuery({ queryKey: ['categories', 'flat'], queryFn: fetchCategories })
  const rows = flatten(tree as CategoryNode[])

  // Read-only view: global categories shown to vendor

  return (
    <>
      <BreadcrumbsNav />
      <Card sx={{ width: '100%' }}>
        <CardHeader title="Categories" />
        <CardContent sx={{ p: 0 }}>
          <Divider />
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
            <Table size="small" sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name (TM)</TableCell>
                  <TableCell>Name (RU)</TableCell>
                  <TableCell>Parent Category</TableCell>
                  <TableCell>Status</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => {
                  const parentName = flat.find((c) => c.id === r.parentId)?.name || '—'
                  return (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ pl: 2 + r.depth * 2 }}>{(r as any).nameTk || r.name || ''}</TableCell>
                      <TableCell>{(r as any).nameRu || ''}</TableCell>
                      <TableCell>{parentName}</TableCell>
                      <TableCell>
                        <Chip size="small" label={r.isActive ? 'active' : 'inactive'} color={r.isActive ? 'success' : 'default'} />
                      </TableCell>
                      
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
    </>
  )
}
