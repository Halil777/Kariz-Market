import { Box, Link, Typography } from '@mui/material'

export function Footer() {
  return (
    <Box component="footer" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Käriz Market · Vendor Portal · v1.0 ·{' '}
        <Link href="#" underline="hover">Support</Link>
      </Typography>
    </Box>
  )
}

export default Footer
