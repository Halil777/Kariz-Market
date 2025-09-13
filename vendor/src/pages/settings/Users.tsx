import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material'
import BreadcrumbsNav from '../../components/common/BreadcrumbsNav'

const users = [
  { name: 'Manager A', role: 'manager', email: 'm.a@vendor.com' },
  { name: 'Staff B', role: 'staff', email: 's.b@vendor.com' },
]

export default function Users() {
  return (
    <>
      <BreadcrumbsNav />
      <Card>
        <CardHeader title="User Management" action={<Button>Add User</Button>} />
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.email}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

