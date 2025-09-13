import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

export default function BreadcrumbsNav() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Link component={RouterLink} color="inherit" to="/dashboard">
        Home
      </Link>
      {segments.map((seg, i) => {
        const to = '/' + segments.slice(0, i + 1).join('/')
        const last = i === segments.length - 1
        return last ? (
          <Typography key={to} color="text.primary">{seg}</Typography>
        ) : (
          <Link key={to} component={RouterLink} color="inherit" to={to}>
            {seg}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
