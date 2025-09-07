import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1c7c54' },
    secondary: { main: '#2b9348' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
  },
});

