import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type Props = {
  open: boolean
  title: string
  message?: string
  onCancel: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmDialog({ open, title, message, onCancel, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {message && (
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onCancel} variant="text">{cancelText}</Button>
        <Button color="error" onClick={onConfirm}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  )
}

