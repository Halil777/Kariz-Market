import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';

type Alert = { type: 'warning' | 'info' | 'error'; text: string };

const alerts: Alert[] = [
  { type: 'warning', text: 'High traffic detected, consider scaling server resources.' },
  { type: 'info', text: 'New product catalog update deployed successfully.' },
  { type: 'error', text: 'Payment gateway integration failed for 3 recent transactions.' },
  { type: 'warning', text: "Low stock alert for popular item: 'Organic Honey'." },
];

export const SystemAlerts: React.FC = () => {
  const { t } = useTranslation();
  const iconFor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <WarningAmberOutlinedIcon color="warning" />;
      case 'info':
        return <InfoOutlinedIcon color="info" />;
      default:
        return <ErrorOutlineIcon color="error" />;
    }
  };
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>{t('dashboard.systemAlerts')}</Typography>
        <List>
          {alerts.map((a, idx) => (
            <ListItem key={idx} divider>
              <ListItemIcon>{iconFor(a.type)}</ListItemIcon>
              <ListItemText primary={a.text} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
