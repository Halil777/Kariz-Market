import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export const CancelOrderDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [reason, setReason] = React.useState('');

  React.useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const handleSubmit = () => {
    onSubmit(reason.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('accountOrders.cancel.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {t('accountOrders.cancel.description')}
        </DialogContentText>
        <TextField
          fullWidth
          multiline
          minRows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          label={t('accountOrders.cancel.reasonLabel')}
          placeholder={t('accountOrders.cancel.reasonPlaceholder')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('accountOrders.cancel.actions.keep')}</Button>
        <Button variant="contained" color="error" onClick={handleSubmit}>
          {t('accountOrders.cancel.actions.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

