import { Card, CardContent, Typography } from '@mui/material'

type Props = { title: string; value: string | number; subtitle?: string }

export default function StatCard({ title, value, subtitle }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h5" sx={{ my: 0.5 }}>{value}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  )
}

