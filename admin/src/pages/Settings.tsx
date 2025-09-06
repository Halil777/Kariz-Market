import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

type Admin = { name: string; email: string; role: string };

export const SettingsPage: React.FC = () => {
  const [platformName, setPlatformName] = React.useState('Kriz Market');
  const [currency, setCurrency] = React.useState('TMT');
  const [paymentGateway, setPaymentGateway] = React.useState('Stripe');
  const [paymentKey, setPaymentKey] = React.useState('');
  const [emailProvider, setEmailProvider] = React.useState('SendGrid');
  const [emailKey, setEmailKey] = React.useState('');
  const [pushProvider, setPushProvider] = React.useState('Firebase');
  const [pushKey, setPushKey] = React.useState('');
  const [commission, setCommission] = React.useState<number>(10);
  const [adminEmail, setAdminEmail] = React.useState('');
  const [admins, setAdmins] = React.useState<Admin[]>([
    { name: 'Sophia Bennett', email: 'sophia.bennett@example.com', role: 'Super Admin' },
    { name: 'Ethan Carter', email: 'ethan.carter@example.com', role: 'Admin' },
    { name: 'Olivia Davis', email: 'olivia.davis@example.com', role: 'Support' },
  ]);

  const addAdmin = () => {
    if (!adminEmail) return;
    setAdmins((prev) => [{ name: adminEmail.split('@')[0], email: adminEmail, role: 'Admin' }, ...prev]);
    setAdminEmail('');
  };

  const removeAdmin = (email: string) => setAdmins((prev) => prev.filter((a) => a.email !== email));

  return (
    <>
      <Typography variant="h5" gutterBottom>Settings</Typography>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>General Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="Platform Name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth type="file" label="Platform Logo" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField select fullWidth label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <MenuItem value="TMT">TMT - Turkmenistan Manat</MenuItem>
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="RUB">RUB - Russian Ruble</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Payment Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField select fullWidth label="Payment Gateway" value={paymentGateway} onChange={(e) => setPaymentGateway(e.target.value)}>
                <MenuItem value="Stripe">Stripe</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Local">Local</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="API Key" value={paymentKey} onChange={(e) => setPaymentKey(e.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Notification Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField select fullWidth label="Email Provider" value={emailProvider} onChange={(e) => setEmailProvider(e.target.value)}>
                <MenuItem value="SendGrid">SendGrid</MenuItem>
                <MenuItem value="SES">AWS SES</MenuItem>
                <MenuItem value="Mailgun">Mailgun</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="Email API Key" value={emailKey} onChange={(e) => setEmailKey(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField select fullWidth label="Push Notification Provider" value={pushProvider} onChange={(e) => setPushProvider(e.target.value)}>
                <MenuItem value="Firebase">Firebase</MenuItem>
                <MenuItem value="OneSignal">OneSignal</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="Push Notification API Key" value={pushKey} onChange={(e) => setPushKey(e.target.value)} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Commission Settings</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth type="number" label="Default Vendor Commission (%)" value={commission} onChange={(e) => setCommission(parseFloat(e.target.value))} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Admin Management</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1 }}>
            <TextField fullWidth placeholder="Enter email address" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            <Button variant="contained" onClick={addAdmin} sx={{ px: 2 }}>Add Admin</Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Admin Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.email} hover>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.role}</TableCell>
                    <TableCell align="right">
                      <Button color="error" size="small" onClick={() => removeAdmin(a.email)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button color="inherit">Cancel</Button>
        <Button variant="contained">Save Changes</Button>
      </Box>
    </>
  );
};
